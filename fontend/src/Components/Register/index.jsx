import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import SignIn from '../Login';


import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button
} from '@chakra-ui/react';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [Name, setName] = useState(''); // Add username state

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users', {
        email: email,
        password: password,
        Name: Name, // Include username in the request
      });

      if (response.status == 200 ) {
        // Handle success (e.g., store token, redirect, update state)
        navigate('/SignIn'); // Redirect to the home page
        
        console.log("Registration successful");
        // Redirect or update state here
      } else { 
        // Handle other responses
        console.log(response.data.message);
        // Show error message to the user
      }
    } catch (error) {
      // Handle errors
      console.error('Registration error:', error.message);
    }
  };

  return (
    <ChakraProvider>
      <Box p={4}>
      <div className="text-center">
          <h1 className="text-4xl font-bold mt-5 mb-3">Register </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align='stretch'>
            <FormControl id="Name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your Name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

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
                  type="password"
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
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
}

export default Register;
