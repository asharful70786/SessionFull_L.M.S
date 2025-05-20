import axiosInstance from "./axiosInstance";

// Register API
export const userRegisterApi = async ({ name, email, password }) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

// Login API
export const userLoginApi = async ({ email, password }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Logout API
export const userLogoutApi = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
};