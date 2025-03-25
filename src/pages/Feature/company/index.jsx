import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "../../../common/antd.css";
import { Table } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext } from "../../../core/API/api-service";
import { companyApi, successToast, errorToast } from "../../../core/core-index";
import { sampleCompanyData } from "../../../core/sampleData/sampleData";

const CompanyManagement = () => {
  const submitCompanyFormSchema = yup
    .object({
      // Basic Info
      name: yup.string().required("Company Name is required"),
      code: yup
        .string()
        .max(8, "Code cannot exceed 8 characters")
        .required("Company Code is required"),
      description: yup
        .string()
        .max(200, "Description cannot exceed 200 characters"),
      address: yup.string().max(100, "Address cannot exceed 100 characters"),
      city: yup.string().required("City is required"),
      pincode: yup.string().max(50, "Pincode cannot exceed 50 characters"),

      // Contact Info
      telephone1: yup
        .string()
        .max(15, "Telephone1 cannot exceed 15 characters"),
      telephone2: yup
        .string()
        .max(15, "Telephone2 cannot exceed 15 characters"),
      mobile1: yup.string().max(15, "Mobile1 cannot exceed 15 characters"),
      mobile2: yup.string().max(15, "Mobile2 cannot exceed 15 characters"),
      fax: yup.string().max(200, "Fax cannot exceed 200 characters"),

      // Tax Information
      gstno: yup.string().max(15, "GST No. cannot exceed 15 characters"),
      gstdate: yup.date().nullable(),
      cstno: yup.string().max(15, "CST No. cannot exceed 15 characters"),
      cstdate: yup.date().nullable(),
      itaxno: yup
        .string()
        .max(50, "Income Tax No. cannot exceed 50 characters"),
      tdsno: yup.string().max(50, "TDS No. cannot exceed 50 characters"),
      exciseno: yup.string().max(50, "Excise No. cannot exceed 50 characters"),

      // Data and Dates
      datapath: yup.string().max(500, "Data Path cannot exceed 500 characters"),
      fromdate: yup.date().nullable(),
      todate: yup.date().nullable(),

      // Company Details
      propertyof: yup
        .string()
        .max(100, "Property Of cannot exceed 100 characters"),
      shortname: yup.string().max(50, "Short Name cannot exceed 50 characters"),
      quote: yup.string().max(500, "Quote cannot exceed 500 characters"),
      prefix: yup.string().max(10, "Prefix cannot exceed 10 characters"),

      // Email and Web
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      website: yup.string().max(200, "Website cannot exceed 200 characters"),

      // Status and Security
      status: yup
        .number()
        .oneOf([0, 1], "Invalid status")
        .required("Status is required"),
      logoname: yup.string().max(100, "Logo Name cannot exceed 100 characters"),
      password: yup.string().max(50, "Password cannot exceed 50 characters"),

      // Boolean Field
      mailinv: yup.boolean(),
    })
    .required();

  const resetData = () => {
    reset({
      company_id: "",
      name: "",
      code: "",
      description: "",
      address: "",
      city: "",
      pincode: "",
      telephone1: "",
      telephone2: "",
      mobile1: "",
      mobile2: "",
      fax: "",
      gstno: "",
      gstdate: "",
      cstno: "",
      cstdate: "",
      itaxno: "",
      tdsno: "",
      exciseno: "",
      datapath: "",
      fromdate: "",
      todate: "",
      propertyof: "",
      shortname: "",
      quote: "",
      prefix: "",
      email: "",
      website: "",
      status: 1,
      logoname: "",
      password: "",
      mailinv: false,
    });
  };

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(submitCompanyFormSchema) });

  const { postData, patchData, getApi, deleteData } =
    useContext(ApiServiceContext);
  const [companyData, setCompanyData] = useState([]);
  const [formAction, setFormAction] = useState("Add");
  const cancelModal = useRef(null);

  const submitCompanyForm = async (data) => {
    try {
      cancelModal.current.click();
      const url = formAction === "Add" ? companyApi.Add : companyApi.Update;

      // Format dates to 'YYYY-MM-DD'
      const formatDate = (date) =>
        date && !isNaN(new Date(date))
          ? new Date(date).toISOString().split("T")[0]
          : null;

      const formData = {
        ...data,
        status: String(data.status),
        mailinv: data.mailinv ? 1 : 0,
        gstdate: formatDate(data.gstdate),
        cstdate: formatDate(data.cstdate),
        fromdate: formatDate(data.fromdate),
        todate: formatDate(data.todate),
      };
      if (formAction !== "Add") {
        formData.company_id = data.id;
        delete formData.id;
        delete formData.password;
        delete formData.created_at;
        delete formData.updated_at;
        delete formData.deleted_at;
        delete formData.deleted_by;
      }

      if (formAction === "Add") {
        delete formData.company_id;
      }
      const response =
        formAction === "Add"
          ? await postData(url, formData)
          : await patchData(url, formData);

      if (response?.status === 200) {
        getCompanyData();
        resetData();
        successToast(
          formAction === "Add"
            ? "Company Added Successfully"
            : "Company Updated Successfully"
        );
      } else {
        errorToast(`Error: ${response?.data?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      errorToast(`Error: ${error || "An error occurred"}`);
    }

  };


  const getCompanyData = useCallback(
    async (page = 1, limit = 5) => {
      try {
        const response = await getApi(
          `${companyApi.Get}?page=${page}&limit=${limit}`
        );
        if (response?.status === 200 && response?.data?.isSuccess) {
          const { companies, pagination } = response.data.payload;

          const formattedCompanies = companies.map((company) => ({
            ...company,
            status: Number(company.status),
            mailinv: Boolean(company.mailinv),
          }));

          setCompanyData(formattedCompanies);
          setPagination({
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalCompanies,
          });
        } else {
          console.error(
            "Failed to fetch company data:",
            response?.data?.message
          );
          setCompanyData(sampleCompanyData);
        }
      } catch (error) {
        console.error("Error fetching company data:", error.message);
        setCompanyData(sampleCompanyData);
      }
    },
    [getApi]
  );

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Handle page change
  const handleTableChange = (pagination) => {
    getCompanyData(pagination.current, pagination.pageSize);
  };

  const addModal = () => {
    setFormAction("Add");
    resetData();
  };

  const editModal = (data) => {
    setFormAction("Edit");
    Object.entries(data).forEach(([key, value]) => setValue(key, value));
  };

  // Custom pagination render
  const itemRender = (_current, type, originalElement) => {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  // Fix row key handling
  const rowKey = (record) =>
    record?.company_id || `${record?.code}-${record?.name}-${Math.random()}`;

  const columns = [
    {
      title: "ID",
      dataIndex: "company_id",
      render: (_text, _record, idx) => idx + 1,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "City", dataIndex: "city" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-greys me-2"
              onClick={() => editModal(record)}
              data-bs-toggle="modal"
              data-bs-target="#add_company"
            >
              <i className="fa fa-edit me-1" /> Edit
            </button>
            <Link
              to="#"
              className="btn btn-greys me-2"
              onClick={() => deleteCompany(record)}
            >
              <i className="fa fa-trash me-1" /> Delete
            </Link>
          </div>
        </>
      ),
    },
  ];

  const deleteCompany = async (record) => {
    try {
      console.log("record : ", record);
      if (!window.confirm("Are you sure you want to delete this company?"))
        return;

      const response = await deleteData(`${companyApi.Delete}/${record.id}`);
      if (response?.status === 200) {
        successToast("Company deleted successfully");
        getCompanyData(pagination.current, pagination.pageSize);
      } else {
        errorToast(response?.data?.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error.message);
      errorToast("An error occurred while deleting the company");
    }
  };

  useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Company Management</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      onClick={() => addModal()}
                      data-bs-target="#add_company"
                    >
                      <i className="fa fa-plus-circle me-2" />
                      Add Company
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
                <div className="card-body CompanyManagement">
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
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={companyData}
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
      <div className="modal custom-modal fade" id="add_company" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <form onSubmit={handleSubmit(submitCompanyForm)} className="w-100">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header border-0 pb-0">
                <h4 className="mb-0">{formAction} Company</h4>
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

              {/* Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Reusable Input Component */}
                  {[
                    { label: "Company Name", name: "name", required: true },
                    { label: "Code", name: "code", required: true },
                    {
                      label: "Description",
                      name: "description",
                      type: "textarea",
                    },
                    { label: "Address", name: "address" },
                    { label: "City", name: "city", required: true },
                    { label: "Pincode", name: "pincode" },
                    { label: "Telephone 1", name: "telephone1" },
                    { label: "Telephone 2", name: "telephone2" },
                    { label: "Mobile 1", name: "mobile1" },
                    { label: "Mobile 2", name: "mobile2" },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      required: true,
                    },
                    { label: "GST No", name: "gstno" },
                    { label: "GST Date", name: "gstdate", type: "date" },
                    { label: "CST No", name: "cstno" },
                    { label: "CST Date", name: "cstdate", type: "date" },
                    { label: "Income Tax No", name: "itaxno" },
                    { label: "TDS No", name: "tdsno" },
                    { label: "Excise No", name: "exciseno" },
                    { label: "Data Path", name: "datapath" },
                    { label: "From Date", name: "fromdate", type: "date" },
                    { label: "To Date", name: "todate", type: "date" },
                    { label: "Property Of", name: "propertyof" },
                    { label: "Short Name", name: "shortname" },
                    { label: "Quote", name: "quote", type: "textarea" },
                    { label: "Prefix", name: "prefix" },
                    { label: "Website", name: "website" },
                    { label: "Logo Name", name: "logoname" },
                    { label: "Password", name: "password", type: "password" },
                    { label: "Fax", name: "fax" },
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

                  {/* Mail Invoice */}
                  <div className="col-lg-6">
                    <div className="form-check">
                      <Controller
                        name="mailinv"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        )}
                      />
                      <label className="form-check-label">Mail Invoice</label>
                      <small className="text-danger">
                        {errors?.mailinv?.message}
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

export default CompanyManagement;
