import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      console.log(response);
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err)
      setErrors(
        // console.log(err.response.data)
        err.response.data.errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;