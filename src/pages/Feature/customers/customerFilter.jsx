/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { search } from "../../../common/imagepath";
import { Link } from "react-router-dom";
import { ApiServiceContext, listcustomerApi } from "../../../core/core-index";
import { useForm } from "react-hook-form";
import { debounce } from "../../../common/helper";

const CustomerFilter = ({
  show,
  setShow,
  setList,
  pagesize,
  page,
  setTotalCount,
  setPage,
  handlePagination,
}) => {
  const { resetField, register } = useForm({});
  const { getData } = useContext(ApiServiceContext);
  const [key, setKey] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState({ value: "", asset: [] });
  const [noDataText, setnoDataText] = useState("");
  const [customer, setCustomer] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    setKey([]);
    let data = searchText.asset;
    if (data.length) {
      data.forEach((data, idx) => {
        resetField(`customer${idx}`);
      });
    }
  }, [searchText]);

  const onSearchChange = async (val) => {
    if (val !== "") {
      try {
        let searchUrl = listcustomerApi;
        if (val !== "") searchUrl = `${searchUrl}?search_customer=${val}`;
        const response = await getData(searchUrl, false);
        if (response.code == 200) {
          let data = response?.data;
          if (data.length > 0) {
            setNoData(false);
            setSearchText({
              value: val,
              asset: response?.data,
            });
          } else {
            setSearchText({
              value: val,
              asset: data,
            });
            setNoData(true);
            setnoDataText("Customers Not Found !");
          }
        }
      } catch {
        setNoData(true);
        setnoDataText("Customers Not Found !");
      }
    } else {
      setKey([]);
      setSearchText({
        value: "",
        asset: [],
      });
      setNoData(false);
      if (key.length > 0) resetList();
    }
  };

  const resetList = async () => {
    let searchUrl = listcustomerApi;
    const response = await getData(searchUrl);
    if (response.code == 200) {
      setList(response?.data || []);
      setTotalCount(response?.totalRecords);
    }
  };

  const handleCheckboxChange = (event, name) => {
    const { value, checked } = event.target;
    if (checked) {
      setKey((prev) => [...prev, name]);
    } else {
      setKey((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleApplyFilter = async (e) => {
    e.preventDefault();
    try {
      let searchUrl = listcustomerApi;
      const queryParams = [];
      let skipSize;
      if (page > 1) {
        setPage(1);
        skipSize = 0;
      }
      else {
        skipSize = (page - 1) * pagesize;
      }
      queryParams.push(`limit=${pagesize}`);
      queryParams.push(`skip=${skipSize}`);

      if (key.length > 0) queryParams.push(`customer=${key.join(",")}`);
      if (queryParams.length > 0)
        searchUrl = `${searchUrl}?${queryParams.join("&")}`;

      const response = await getData(searchUrl);
      if (response.code == 200) {
        if (page > 1) {
          setPage(1);
        }
        setList(response?.data || []);
        setTotalCount(response?.totalRecords);
        setShow(false);
      }
    } catch {
      return false;
    }
  };

  const handleFilterclear = async () => {
    // resetList();
    setKey([]);
    setSearchText({ value: "", asset: [] });
    setNoData(false);
    handlePagination(1, 10);
    setSearchInputValue("");
  };

  const onSearchprocessChange = debounce(onSearchChange, 200);

  return (
    <>
      <div className={`toggle-sidebar ${show ? "open-filter" : ""}`}>
        <div className="sidebar-layout-filter">
          <div className="sidebar-header">
            <h5>Filter</h5>
            <Link
              to="#"
              className="sidebar-closes"
              onClick={() => {
                setShow(!show);
              }}
            >
              <i className="fa-regular fa-circle-xmark" />
            </Link>
          </div>
          <div className="sidebar-body">
            <form
              autoComplete="off"
            >
              {/* Customer */}
              <div className="accordion" id="accordionMain1">
                <div
                  className="card-header-new"
                  id="headingOne"
                  onClick={() => setCustomer(!customer)}
                >
                  <h6 className="filter-title">
                    <Link
                      to="#"
                      className={customer ? "w-100" : "w-100 collapsed"}
                      aria-expanded={customer}
                    >
                      Customer
                      <span className="float-end">
                        <i className="fa-solid fa-chevron-down" />
                      </span>
                    </Link>
                  </h6>
                </div>
                <div
                  id="collapseOne"
                  className={customer ? "collapse show" : "collapse"}
                >
                  <div className="card-body-chat">
                    <div className="row">
                      <div className="col-md-12">
                        <div id="checkBoxes1">
                          <div className="form-custom">
                            <input
                              type="text"
                              className="form-control"
                              id="member_search1"
                              placeholder="Search Customers"
                              onChange={(e) => {
                                const val = e?.target?.value.toLowerCase();
                                setSearchText({
                                  value: val,
                                  asset: [],
                                });
                                setSearchInputValue(val);
                                onSearchprocessChange(val);
                              }}
                              value={searchInputValue} 
                            />
                            <span>
                              <img src={search} alt="img" />
                            </span>
                          </div>
                          <div className="selectBox-cont">
                            {searchText?.asset?.length > 0 &&
                              searchText?.asset.map((item, index) => {
                                return (
                                  <label
                                    className="custom_check w-100"
                                    key={index}
                                  >
                                    <input
                                      type="checkbox"
                                      {...register(`customer${index}`)}
                                      defaultChecked={false}
                                      onChange={(e) =>
                                        handleCheckboxChange(e, item?._id)
                                      }
                                    />
                                    <span className="checkmark" /> {item.name}
                                  </label>
                                );
                              })}
                            {noData && <span>{noDataText}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Customer */}
              <div className="filter-buttons">
                <button
                  onClick={handleApplyFilter}
                  disabled={key.length > 0 ? false : true}
                  className="d-inline-flex align-items-center justify-content-center btn w-100 btn-primary"
                >
                  {key.length > 0 ? "Apply" : "Select Customers"}
                </button>
                <button
                  type="button"
                  onClick={handleFilterclear}
                  disabled={
                    searchText.value == "" && key.length == 0 ? true : false
                  }
                  className="d-inline-flex align-items-center justify-content-center btn w-100 btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerFilter;
