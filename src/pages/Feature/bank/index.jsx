import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext } from "../../../core/API/api-service";
import { bankApi, successToast, errorToast } from "../../../core/core-index";

const BankMaster = () => {
  const bankSchema = yup.object({
    acc_type_id: yup.number().required("Enter Account Type ID"),
    name: yup.string().required("Enter Bank Name"),
    city: yup.string().required("Enter City"),
    state: yup.string().required("Enter State"),
    district: yup.string().required("Enter District"),
    branchname: yup.string().required("Enter Branch Name"),
    ifsccode: yup.string().required("Enter IFSC Code"),
    micrcode: yup.string().required("Enter MICR Code"),
    branchcode: yup.string().required("Enter Branch Code"),
    accno: yup.string().required("Enter Account Number"),
    openbal: yup.number().required("Enter Opening Balance"),
    company_id: yup.number().required("Select Company"),
    created_by: yup.string().required("Created By is required"),
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(bankSchema) });

  const { postData, getData, patchData, deleteData } = useContext(ApiServiceContext);
  const [bankData, setBankData] = useState([]);
  const [formAction, setFormAction] = useState("Add");
  const cancelModal = useRef(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const getBankData = useCallback(async (page = 1, limit = 5) => {
    try {
      const response = await getData(`${bankApi.Get}?page=${page}&limit=${limit}`);
      if (response?.status === 200 && response?.data?.isSuccess) {
        setBankData(response.data.payload.banks);
        setPagination({
          current: response.data.payload.pagination.currentPage,
          pageSize: response.data.payload.pagination.pageSize,
          total: response.data.payload.pagination.totalBanks,
        });
      } else {
        console.error("Failed to fetch bank data:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error.message);
    }
  }, [getData]);

  useEffect(() => {
    getBankData();
  }, [getBankData]);

  const addModal = () => {
    setFormAction("Add");
    reset();
  };

  const submitBankForm = async (data) => {
    try {
      cancelModal.current.click();
      let response;
      if (formAction === "Add") {
        response = await postData(bankApi.Add, data);
      } else {
        response = await patchData(`${bankApi.Update}`, data);
      }
      if (response?.status === 200) {
        getBankData();
        reset();
        successToast(formAction === "Add" ? "Bank Added Successfully" : "Bank Updated Successfully");
      } else {
        errorToast(response?.data?.message || "An error occurred");
      }
    } catch (error) {
      errorToast(error.message || "An error occurred");
    }
  };

  const editModal = (data) => {
    setFormAction("Edit");
    Object.keys(data).forEach((key) => setValue(key, data[key]));
  };

  const deleteBank = async (record) => {
    try {
      if (!window.confirm("Are you sure you want to delete this Bank?")) return;
      const response = await deleteData(`${bankApi.Delete}/${record.id}`);
      if (response?.status === 200) {
        successToast("Bank deleted successfully");
        getBankData(pagination.current, pagination.pageSize);
      } else {
        errorToast(response?.data?.message || "Failed to delete bank");
      }
    } catch (error) {
      errorToast("An error occurred while deleting the bank");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Branch", dataIndex: "branchname" },
    { title: "IFSC Code", dataIndex: "ifsccode" },
    { title: "Account Number", dataIndex: "accno" },
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
                  onClick={() => deleteBank(record)}
                >
                  <i className="fa fa-trash me-1" /> Delete
                </Link>
              </div>
            </>
          ),
        },
  ];

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
  // Handle page change
  const handleTableChange = (pagination) => {
    getBankData(pagination.current, pagination.pageSize);
  };
  // Fix row key handling
  const rowKey = (record) =>
    record?.company_id || `${record?.code}-${record?.name}-${Math.random()}`;
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
                      dataSource={bankData}
                      onChange={handleTableChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankMaster;

