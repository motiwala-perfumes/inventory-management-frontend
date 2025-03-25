/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../../common/antd.css";
import { Table } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBranchListData } from "../../helperApis/api";
import {
  itemRender,
} from "../../../common/paginationfunction";
import { ApiServiceContext } from "../../../core/API/api-service";
import { positionApi, successToast, errorToast } from "../../../core/core-index";
import { samplePositionData } from "../../../core/sampleData/sampleData";

const PositionMaster = () => {
  const submitUserTypeFormschema = yup.object({
    positionName: yup.string().required("Enter Position Name"),
    status: yup
      .string()
      .oneOf(["0", "1"], "Select a valid Status")
      .required("Select Status"),
    branch: yup.string().required("Select Branch"),
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(submitUserTypeFormschema) });

  const { postData, getData, patchData, deleteData } = useContext(ApiServiceContext);
  const [positionData, setPositionData] = useState([]);
  const [formAction, setformAction] = useState("Add");
  const cancelModal = useRef(null);
  const [positionList, setPositionList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const getBranchListData = useBranchListData(getData);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getBranchListData();
        setPositionList(data);
      } catch (error) {
        console.error("Error fetching company list:", error);
      }
    };

    fetchCompanies();
  }, [getBranchListData]);

  const getPositionData = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await getData(
          `${positionApi.Get}?page=${page}&limit=${limit}`
        );
        if (response?.status === 200 && response?.data?.isSuccess) {
          const { positions, pagination } = response.data.payload;

          const formattedPositions = positions.map((position) => ({
            ...position,
            statusLabel: position.status === "0" ? "Inactive" : "Active",
          }));

          setPositionData(formattedPositions);
          setPagination({
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalPositions,
          });
        } else {
          console.error("Failed to fetch Positions data:", response?.data?.message);
          setPositionData(samplePositionData);
        }
      } catch (error) {
        console.error("Error fetching Positions data:", error.message);
        setPositionData(samplePositionData);
      }
    },
    [getData]
  );

  useEffect(() => {
    getPositionData();
  }, [getPositionData]);

  const addModal = () => {
    setformAction("Add");
    reset({ positionName: "", status: "", branch: "" });
  };

  const submitUserTypeForm = async (data) => {
    try {
      cancelModal.current.click();

      const formData = {
        id: data.id,
        name: data.name,
        branch_id: data.branch_id,
        status: data.status,
        created_by: data.created_by,
        updated_by: data.updated_by,
      };

      let response;
      if (formAction === "Add") {
        delete formData.id;
        response = await postData(positionApi.Add, formData);
      } else {
        delete formData.branch_id;
        response = await patchData(`${positionApi.Update}`, formData);
      }

      if (response?.status === 200) {
        getPositionData();
        reset();
        successToast(
          formAction === "Add" ? "Position Added Successfully" : "Position Updated Successfully"
        );
      } else {
        errorToast(`${response?.data?.message || "An error occurred"}`);
      }
    } catch (error) {
      errorToast(`${error.message || "An error occurred"}`);
    }
  };
  
  const editModal = (data) => {
    console.log("Editing Position: ", data);
    setformAction("Edit");
    setValue("positionName", data?.positionName || "");
    setValue("status", data?.status || "");
    setValue("branch", data?.branch_id || "");
    setValue("_id", data?.id);
  };

  const deletePosition = async (record) => {
    try {
      if (!window.confirm("Are you sure you want to delete this Position?")) return;
      const response = await deleteData(`${positionApi.Delete}/${record.id}`);
      if (response?.status === 200) {
        successToast("Position deleted successfully");
        getPositionData(pagination.current, pagination.pageSize);
      } else {
        errorToast(response?.data?.message || "Failed to delete Position");
      }
    } catch (error) {
      console.error("Error deleting Position:", error.message);
      errorToast("An error occurred while deleting the Position");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "positionName" },
    { title: "Branch", dataIndex: "branch_id" },
    { title: "Status", dataIndex: "statusLabel" },
    { title: "Created By", dataIndex: "created_by" },
    { title: "Created On", dataIndex: "created_at" },
    { title: "Updated On", dataIndex: "updated_at" },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <Link
                to="#"
                className="btn btn-greys me-2"
                data-bs-toggle="modal"
                onClick={() => editModal(record)}
                data-bs-target="#add_type"
              >
                <i className="fa fa-edit me-1" /> Edit
              </Link>
              <Link
                to="#"
                className="btn btn-greys me-2"
                onClick={() => deletePosition(record)}
              >
                <i className="fa fa-trash me-1" /> Delete
              </Link>
            </div>

          </>
        );
      },
    },
  ];

  const resetData = () => {
    reset();
  };

  const handleTableChange = (pagination) => {
    getPositionData(pagination.current, pagination.pageSize);
  };
  const rowKey = (record) =>
    record?.position_id || `${record?.code}-${record?.name}-${Math.random()}`;
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header ">
              <h5>Position Master</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      onClick={() => addModal()}
                      data-bs-target="#add_type"
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Add Position
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body UserTypes">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={rowKey}
                      pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: handleTableChange,
                        itemRender,
                      }}
                      columns={columns}
                      dataSource={positionData}
                      onChange={handleTableChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="add_type" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={handleSubmit(submitUserTypeForm)} className="w-100">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header border-0 pb-0">
                <h4 className="mb-0">{formAction} Position</h4>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetData}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Position Name</label>
                  <Controller name="positionName" control={control} render={({ field }) => <input className="form-control" {...field} />} />
                  <small>{errors.positionName?.message}</small>
                </div>
                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group input_text mb-0">
                    <label>Status</label>
                    <div>
                      <Controller
                        name="statusLabel"
                        control={control}
                        render={({ field }) => (
                          <div className="d-flex">
                            <label className="form-check form-check-inline d-flex align-items-center me-3 ps-0">
                              <input
                                type="radio"
                                value="Deactive"
                                className="form-check-inputs me-1"
                                checked={String(field.value).toLowerCase() === "Deactive".toLowerCase()}
                                onChange={() => field.onChange("Deactive")}
                              />
                              <span className="form-check-label">Deactive</span>
                            </label>

                            <label className="form-check form-check-inline d-flex align-items-center me-3">
                              <input
                                type="radio"
                                value="Active"
                                className="form-check-inputs me-1"
                                checked={String(field.value).toLowerCase() === "Active".toLowerCase()}
                                onChange={() => field.onChange("Active")}
                              />
                              <span className="form-check-label">Active</span>
                            </label>
                          </div>
                        )}
                      />
                      <small className="text-danger">{errors.status?.message}</small>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <Controller name="branch_id" control={control} render={({ field }) => (
                    <select className="form-control" {...field}>
                      <option value="">Select Branch</option>
                      {positionList.map((branch) => (
                        <option key={branch.value} value={branch.value}>
                          {branch.key}
                        </option>
                      ))}
                    </select>
                  )} />
                  <small>{errors.branch_id?.message}</small>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  onClick={() => resetData()}
                  to="#"
                  ref={cancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Close
                </Link>
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PositionMaster;
