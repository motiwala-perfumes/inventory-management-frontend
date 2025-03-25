import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext } from "../../../core/API/api-service";
import { branchApi, successToast, errorToast } from "../../../core/core-index";
import { sampleBranchData } from "../../../core/sampleData/sampleData";
import { useCompanyListData } from "../../helperApis/api";

const Branch = () => {
  const cancelModal = useRef(null);
  const { postData, getData, patchData, deleteData } =
    useContext(ApiServiceContext);

  const branchFormSchema = yup.object({
    name: yup.string().required("Enter Branch Name"),
    code: yup.string().required("Enter Branch Code"),
    mobile_no: yup
      .string()
      .required("Enter Mobile Number")
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    status: yup.string().required("Select Status"),
    address: yup.string().required("Enter Address"),
    city: yup.string().required("Enter City"),
    pincode: yup
      .string()
      .required("Enter Pincode")
      .matches(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
    company_id: yup.string().required("Company ID is required"),
  });

  const [branchData, setBranchData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [formAction, setFormAction] = useState("Add");
  const [companyList, setCompanyList] = useState([]);

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(branchFormSchema) });

  const getCompanyListData = useCompanyListData(getData);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanyListData();
        setCompanyList(data);
      } catch (error) {
        console.error("Error fetching company list:", error);
      }
    };

    fetchCompanies();
  }, [getCompanyListData]);

  const getBranchData = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await getData(
          `${branchApi.Get}?page=${page}&limit=${limit}`
        );
        if (response?.status === 200 && response?.data?.isSuccess) {
          const { branches, pagination } = response.data.payload;

          const formattedBranches = branches.map((branch) => ({
            ...branch,
            status: Number(branch.status),
          }));

          setBranchData(formattedBranches);
          setPagination({
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalBranches,
          });
        } else {
          console.error("Failed to fetch branch data:", response?.data?.message);
          setBranchData(sampleBranchData);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error.message);
        setBranchData(sampleBranchData);
      }
    },
    [getData]
  );

  useEffect(() => {
    getBranchData();
  }, [getBranchData]);

  const resetData = () => {
    reset({
      id: "",
      name: "",
      code: "",
      mobile_no: "",
      status: "1",
      address: "",
      city: "",
      pincode: "",
      company_id: "",
    });
  };

  const rowKey = (record) =>
    record?.branch_id || `${record?.code}-${record?.name}-${Math.random()}`;

  const itemRender = (_current, type, originalElement) => {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const submitBranchForm = async (data) => {
    try {
      cancelModal.current.click();
      const url =
        formAction === "Add"
          ? branchApi.Add
          : `${branchApi.Update}`;

      const formData = {
        branch_id: data.id || undefined,
        name: data.name,
        code: data.code,
        mobile_no: data.mobile_no,
        status: String(data.status),
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        company_id: data.company_id,
      };

      if (formAction === "Add") {
        delete formData.branch_id;
      }
      if (formAction !== "Add") {
        delete formData.company_id;
      }
      const response =
        formAction === "Add"
          ? await postData(url, formData)
          : await patchData(url, formData);

      if (response?.status === 200) {
        getBranchData();
        resetData();
        successToast(
          formAction === "Add"
            ? "Branch Added Successfully"
            : "Branch Updated Successfully"
        );
      } else {
        errorToast(`Error: ${response?.data?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      errorToast(`Error: ${error || "An error occurred"}`);
    }
  };

  const deleteBranch = async (record) => {
    try {
      if (!window.confirm("Are you sure you want to delete this branch?"))
        return;

      const response = await deleteData(`${branchApi.Delete}/${record.id}`);
      if (response?.code === 200) {
        successToast("Branch deleted successfully");
        getBranchData();
      } else {
        errorToast(response?.data?.message || "Failed to delete branch");
      }
    } catch (error) {
      console.error("Error deleting branch:", error.message);
      errorToast("An error occurred while deleting the branch");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "branch_id",
      render: (_text, _record, idx) => idx + 1,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "Mobile Number", dataIndex: "mobile_no" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    { title: "City", dataIndex: "city" },
    { title: "Pincode", dataIndex: "pincode" },
    {
      title: "Action",
      render: (_, record) => (
        <>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-greys me-2"
              onClick={() => editModal(record)}
              data-bs-toggle="modal"
              data-bs-target="#add_branch"
            >
              <i className="fa fa-edit me-1" /> Edit
            </button>
            <Link
              to="#"
              className="btn btn-greys me-2"
              onClick={() => deleteBranch(record)}
            >
              <i className="fa fa-trash me-1" /> Delete
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    getBranchData(pagination.current, pagination.pageSize);
  };

  const addModal = () => {
    setFormAction("Add");
    resetData();
  };
  const editModal = (data) => {
    setFormAction("Edit");
    Object.entries(data).forEach(([key, value]) => setValue(key, value));
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Branch Management</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      onClick={addModal}
                      data-bs-target="#add_branch"
                    >
                      <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                      Add Branch
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
                <div className="card-body company-management">
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
                      dataSource={branchData}
                      onChange={handleTableChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div className="modal custom-modal fade" id="add_branch" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form onSubmit={handleSubmit(submitBranchForm)} className="w-100">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header border-0 pb-0">
                <h4 className="mb-0">{formAction} Branch</h4>
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

              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Reusable Input Component */}
                  {[
                    { label: "Branch Name", name: "name", required: true },
                    { label: "Branch Code", name: "code", required: true },
                    { label: "Mobile Number", name: "mobile_no", required: true },
                    { label: "Address", name: "address", type: "textarea" },
                    { label: "City", name: "city", required: true },
                    { label: "Pincode", name: "pincode" },
                  ].map(({ label, name, type = "text", required }) => (
                    <div className="col-lg-6" key={name}>
                      <div className="form-group">
                        <label>
                          {label}{" "}
                          {required && <span className="text-danger">*</span>}
                        </label>
                        <Controller
                          name={name}
                          control={control}
                          render={({ field }) =>
                            type === "textarea" ? (
                              <textarea
                                className="form-control"
                                {...field}
                                placeholder={`Enter ${label}`}
                                rows="2"
                              />
                            ) : (
                              <input
                                type={type}
                                className="form-control"
                                {...field}
                                placeholder={`Enter ${label}`}
                              />
                            )
                          }
                        />
                        <small className="text-danger">
                          {errors?.[name]?.message}
                        </small>
                      </div>
                    </div>
                  ))}

                  {/* Company ID */}
                  <div className="col-lg-6" key="company_id">
                    <div className="form-group">
                      <label>
                        Company ID <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => (
                          <select className="form-control" {...field}>
                            <option value="">Select Company</option>
                            {companyList.map((company) => (
                              <option key={company.value} value={company.value}>
                                {company.key}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      <small className="text-danger">
                        {errors?.company_id?.message}
                      </small>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        Status <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <select className="form-control" {...field}>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        )}
                      />
                      <small className="text-danger">
                        {errors?.status?.message}
                      </small>
                    </div>
                  </div>
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

export default Branch;
