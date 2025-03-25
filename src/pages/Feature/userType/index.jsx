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
import { userTypeApi, successToast, errorToast } from "../../../core/core-index";
import { sampleUserTypeData } from "../../../core/sampleData/sampleData";

const UserTypes = () => {
  const submitUserTypeFormschema = yup.object({
    name: yup.string().required("Enter Name"),
    userType: yup
      .string()
      .oneOf(["0", "1"], "Select a valid User Type")
      .required("Select User Type"),
    branch_id: yup.string().required("Select Branch"),
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(submitUserTypeFormschema) });

  const { postData, getData, patchData, deleteData } = useContext(ApiServiceContext);
  const [usertypedata, setUserTypeData] = useState([]);
  const [formAction, setformAction] = useState("Add");
  const cancelModal = useRef(null);
  const [branchList, setBranchList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const submitUserTypeForm = async (data) => {
    try {
      cancelModal.current.click();

      const formData = {
        userType: data.userType,
        branch_id: data.branch_id,
        name: data.name,
        usertype_id: data._id,
      };

      let response;

      if (formAction === "Add") {
        delete formData.usertype_id;
      }
      if (formAction !== "Add") {
        delete formData.branch_id;
      }
      if (formAction === "Add") {
        response = await postData(userTypeApi.Add, formData);
      } else {
        response = await patchData(`${userTypeApi.Update}`, formData);
      }
      console.log("response :", response);
      if (response?.status === 200) {
        getUserTypedata();
        reset();
        successToast(
          formAction === "Add"
            ? "User Type Added Successfully"
            : "User Type Updated Successfully"
        );
      } else {
        errorToast(`Error: ${response?.data?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      errorToast(`Error: ${error.message || "An error occurred"}`);
    }
  };

  const deleteUserType = async (record) => {
    try {
      console.log("record : ", record);
      if (!window.confirm("Are you sure you want to delete this User Type?"))
        return;

      const response = await deleteData(`${userTypeApi.Delete}/${record.id}`);
      if (response?.status === 200) {
        successToast("User Type deleted successfully");
        getUserTypedata(pagination.current, pagination.pageSize);
      } else {
        errorToast(response?.data?.message || "Failed to delete User Type");
      }
    } catch (error) {
      console.error("Error deleting User Type:", error.message);
      errorToast("An error occurred while deleting the User Type");
    }
  };

  const getBranchListData = useBranchListData(getData);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getBranchListData();
        setBranchList(data);
      } catch (error) {
        console.error("Error fetching company list:", error);
      }
    };

    fetchCompanies();
  }, [getBranchListData]);

  const getUserTypedata = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await getData(
          `${userTypeApi.Get}?page=${page}&limit=${limit}`
        );
        if (response?.status === 200 && response?.data?.isSuccess) {
          const { userTypes, pagination } = response.data.payload;

          const formatteUserTypes = userTypes.map((uTypes) => ({
            ...uTypes,
            userTypeName: uTypes.userType === '0' ? 'Is Department' : "Is Cash Counter"
          }));

          setUserTypeData(formatteUserTypes);
          setPagination({
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalBranches,
          });
        } else {
          console.error("Failed to fetch User Types data:", response?.data?.message);
          setUserTypeData(sampleUserTypeData);
        }
      } catch (error) {
        console.error("Error fetching User Types data:", error.message);
        setUserTypeData(sampleUserTypeData);
      }
    },
    [getData]
  );

  const addModal = () => {
    setformAction("Add");
    reset({ name: "", userType: "", branch_id: "" });
  };

  const editModal = (data) => {
    console.log("data?.userType : ", data);
    setformAction("Edit");
    setValue("name", data?.name || "");
    setValue("userType", data?.userType || "");
    setValue("branch_id", data?.branch_id || "");
    setValue("_id", data?.id);
  };


  const handleTableChange = (pagination) => {
    getUserTypedata(pagination.current, pagination.pageSize);
  };
  useEffect(() => {
    getUserTypedata();
  }, [getUserTypedata]);

  const columns = [
    {
      title: "ID",
      dataIndex: "userType_id",
      render: (_text, _record, idx) => idx + 1,
    },
    {
      title: "Type",
      dataIndex: "name",
    },
    {
      title: "Position",
      dataIndex: "userTypeName",
    },
    {
      title: "Created On",
      dataIndex: "created_at",
    },
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
                onClick={() => deleteUserType(record)}
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

  const rowKey = (record) =>
    record?.userType_id || `${record?.code}-${record?.name}-${Math.random()}`;
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header ">
              <h5>User Type</h5>
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
                      Add Type
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
                      dataSource={usertypedata}
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
                <h4 className="mb-0">{formAction} User Type</h4>
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
                  <label>User Type Name</label>
                  <Controller name="name" control={control} render={({ field }) => <input className="form-control" {...field} />} />
                  <small>{errors.name?.message}</small>
                </div>
                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group input_text mb-0">
                    <label>User Type</label>
                    <div>
                      <Controller
                        name="userType"
                        control={control}
                        render={({ field }) => (
                          <div className="d-flex">
                            <label className="form-check form-check-inline d-flex align-items-center me-3 ps-0">
                              <input
                                type="radio"
                                value="0"
                                className="form-check-inputs me-1"
                                checked={field.value === "0"}
                                onChange={() => field.onChange("0")}
                              />
                              <span className="form-check-label">Is Department</span>
                            </label>

                            <label className="form-check form-check-inline d-flex align-items-center me-3">
                              <input
                                type="radio"
                                value="1"
                                className="form-check-inputs me-1"
                                checked={field.value === "1"}
                                onChange={() => field.onChange("1")}
                              />
                              <span className="form-check-label">Is Cash Counter</span>
                            </label>
                          </div>
                        )}
                      />
                      <small className="text-danger">{errors.userType?.message}</small>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <Controller name="branch_id" control={control} render={({ field }) => (
                    <select className="form-control" {...field}>
                      <option value="">Select Branch</option>
                      {branchList.map((branch) => (
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

export default UserTypes;
