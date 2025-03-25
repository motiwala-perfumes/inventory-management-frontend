/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { createContext, useContext } from "react";
import { AxiosContext } from "../interceptor/interceptor";
export const ApiServiceContext = createContext();

const ApiServiceProvider = (props) => {
  const { axiosInstance, axiosInstancewithoutloader } =
    useContext(AxiosContext);

  const postData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`${process.env.REACT_APP_BACKEND_URL}${url}`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getData = (url, loader = true) => {
    return new Promise((resolve, reject) => {
      let apiInstance =
        loader == false ? axiosInstancewithoutloader : axiosInstance;
      apiInstance
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const patchData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const putData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const deleteData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .delete(url, { data: data })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getApi = async (url, token = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${url}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.message);
      throw error; // Let the caller handle the error
    }
  };



  return (
    <ApiServiceContext.Provider
      value={{ getData, postData, patchData, putData, deleteData, getApi }}
    >
      {props.children}
    </ApiServiceContext.Provider>
  );
};

export default ApiServiceProvider;
