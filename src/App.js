import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from './firebase.init';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameBlur = (event) => {
    setName(event.target.value);
  };
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };
  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
    console.log(event.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError('Password should contained 1 spacial character');
      return;
    }

    setValidated(true);
    setError('');

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail(); // email verify function call
          setUserName(); // update user info
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
    event.preventDefault();
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent!');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('update user name');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log('Email verification sent');
    });
  };

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className="text-primary">
          Please {registered ? 'Login' : 'Register'}!!
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Enter your name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your Name.
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* email input field*/}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>

          {/* password  field*/}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already Registered ?"
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">
            Forget Password
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
      {/* simple form */}
      {/* <form onSubmit={handleFormSubmit}>
        <input
          onBlur={handleEmailBlur}
          type="email"
          name=""
          id=""
          placeholder="Email"
        />
        <br />
        <input
          onBlur={handlePasswordBlur}
          type="password"
          name=""
          id=""
          placeholder="Password"
        />
        <br />
        <input type="submit" value="Login" />
      </form> */}
    </div>
  );
}

export default App;
