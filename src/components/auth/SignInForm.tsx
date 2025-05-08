import React, { useState, ReactElement } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { login } from "../../store/slice/auth";
import { useNavigate } from "react-router-dom";


interface LoginFormValues {
  email: string;
  password: string;
}

interface FormStatus {
  error?: string;
}

export default function SignInForm(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
  });

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues, { setStatus }: FormikHelpers<LoginFormValues>) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(login(values));
      if (login.fulfilled.match(resultAction)) {
        const { role } = resultAction.payload;
        if (role !== "admin") {
          setStatus({ error: "Invalid username or password" });
          setLoading(false);
          return;
        }
        navigate("/");
      } else {
        setStatus({ error: resultAction.payload as string });
      }
    } catch (err: any) {
      setStatus({ error: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.leftSide}>
          <a href="#" style={styles.logoLink}>
            <img src="/images/logo/auth3.png" alt="login-img" style={styles.leftImage} />
          </a>
        </div>

        <div style={styles.rightSide}>
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <img src="/images/logo/logo2.png" alt="Logo" style={styles.logo} />
              <h1 style={styles.title}>Admin Dashboard</h1>
              <p style={styles.subtitle}>Enter your credentials to access the admin panel</p>
            </div>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched, isSubmitting, status }) => (
                <Form style={styles.form}>
                  <label htmlFor="email" style={styles.label}>
                    Email
                  </label>
                  <div style={styles.inputWrapper}>
                    <Field id="email" name="email" type="email" placeholder="Email" style={errors.email && touched.email ? { ...styles.input, ...styles.inputError } : styles.input} />
                    <ErrorMessage name="email" render={(msg) => <div style={styles.errorText}>{msg}</div>} />
                  </div>

                  <label htmlFor="password" style={{ ...styles.label, marginTop: "16px" }}>
                    Password
                  </label>
                  <div style={errors.password && touched.password ? { ...styles.passwordContainer, ...styles.inputError } : styles.passwordContainer}>
                    <Field id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Password" style={styles.passwordInput} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage name="password" render={(msg) => <div style={styles.errorText}>{msg}</div>} />

                  {status?.error && <div style={styles.statusError}>{status.error}</div>}

                  <div style={styles.forgotPasswordContainer}>
                    <a href="#" style={styles.forgotPasswordText}>
                      {/* Forgot Password? */}
                    </a>
                  </div>

                  <button type="submit" style={styles.loginButton} disabled={isSubmitting || loading}>
                    {loading ? "Loading..." : "Log In"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  box: {
    display: "flex",
    width: "100%",
    maxWidth: "1024px",
    height: "640px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    position: "relative" as const,
    backgroundColor: "#ffffff",
  },
  leftSide: {
    width: "50%",
    height: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  },
  logoLink: {
    position: "absolute" as const,
    bottom: "60px",
    left: "56px",
  },
  leftImage: {
    width: "100%",
    height: "auto",
    objectFit: "contain" as const,
  },
  rightSide: {
    width: "45%",
    height: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box" as const,
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
  },
  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginBottom: "40px",
  },
  logo: {
    width: "140px",
    height: "80px",
    marginBottom: "16px",
    objectFit: "contain" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#000",
    marginBottom: "8px",
    textAlign: "center" as const,
  },
  subtitle: {
    fontSize: "14px",
    color: "#808080",
    fontWeight: "500",
    textAlign: "center" as const,
  },
  form: {
    width: "100%",
  },
  label: {
    marginBottom: "8px",
    color: "#808080",
    display: "block",
    fontSize: "14px",
  },
  inputWrapper: {
    width: "100%",
  },
  input: {
    height: "48px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#dedede",
    borderRadius: "10px",
    paddingLeft: "12px",
    paddingRight: "12px",
    backgroundColor: "#ffffff",
    width: "100%",
    boxSizing: "border-box" as const,
    fontSize: "14px",
  },
  inputError: {
    borderColor: "#ff4d4f",
  },
  errorText: {
    color: "#ff4d4f",
    marginTop: "4px",
    fontSize: "12px",
  },
  statusError: {
    color: "#ff4d4f",
    marginTop: "16px",
    textAlign: "center" as const,
    padding: "8px",
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    borderRadius: "5px",
    fontSize: "14px",
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#dedede",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    paddingRight: "12px",
    boxSizing: "border-box" as const,
  },
  passwordInput: {
    flex: 1,
    height: "48px",
    paddingLeft: "12px",
    paddingRight: "12px",
    border: "none",
    outline: "none",
    borderRadius: "10px",
    width: "100%",
    fontSize: "14px",
  },
  eyeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#808080",
    padding: "0 12px",
  },
  forgotPasswordContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px",
    marginBottom: "24px",
  },
  forgotPasswordText: {
    color: "#1e1e1e",
    fontWeight: "500",
    textDecoration: "none",
    fontSize: "14px",
  },
  loginButton: {
    height: "50px",
    backgroundColor: "#3F63C7",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    width: "100%",
    border: "none",
    cursor: "pointer",
  },
};
