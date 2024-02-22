import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";

function SignIn({ onLoginSuccess }) {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email: email,
        password: password,
      });

      if (response.data.message === "success") {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("email", email);
        onLoginSuccess(); // เรียกใช้ฟังก์ชันหลังจาก Login
        console.log("Login successful");
        toast.success("Login successful");
        navigate("/User");
      } else {
        console.log(response.data.message);
        toast.error("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Login error:", error.response.data.message);
        toast.error("Login error: " + error.response.data.message);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received");
      } else {
        console.error("Error:", error.message);
        toast.error("Error: " + error.message);
      }
    }
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mt-5 mb-3">Login</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button colorScheme="blue" type="submit">
              Login
            </Button>

          
          </VStack>
        </form>
      </Box>
      <ToastContainer />
    </ChakraProvider>
  );
}

SignIn.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};
export default SignIn;