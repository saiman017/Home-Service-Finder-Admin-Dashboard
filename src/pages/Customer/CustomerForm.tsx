import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Select, Button, DatePicker } from "antd";
import { AppDispatch } from "../../store/store";
import dayjs from "dayjs";
import { fetchAllRoles } from "../../store/slice/role";
import { editUser, fetchAllUsers, fetchUserById } from "../../store/slice/user";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  role: string;
  isEmailVerified: boolean;
}
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T | string;
  message: string;
}

interface UserFormikProps {
  userId?: string;
  isNewUser: boolean;
  onClose: () => void;
  afterSubmit?: () => void;
  initialData?: User | null;
}

export const UserFormik: React.FC<UserFormikProps> = ({ userId, isNewUser, onClose, afterSubmit, initialData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState<User | null>(initialData || null);
  const [customerRoleId, setCustomerRoleId] = useState<string>("");

  // Fetch Customer Role ID
  useEffect(() => {
    dispatch(fetchAllRoles())
      .unwrap()
      .then((roles) => {
        const role = roles.find((r: any) => r.name?.toLowerCase() === "customer");
        if (role) setCustomerRoleId(role.id);
      });
  }, [dispatch]);

  // Fetch user data for editing
  useEffect(() => {
    if (!isNewUser && userId && !initialData) {
      dispatch(fetchUserById(userId))
        .unwrap()
        .then((data) => setUserData(data))
        .catch((err) => console.error("Failed to fetch user", err));
    } else if (initialData) {
      setUserData(initialData);
    }
  }, [dispatch, isNewUser, userId, initialData]);

  const initialValues = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    gender: userData?.gender || "",
    dateOfBirth: userData?.dateOfBirth || "",
    role: userData?.role || customerRoleId || "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Z][a-z]*$/, "First name must start with a capital letter"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Z][a-z]*$/, "Last name must start with a capital letter"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Must be 10 digits"),
    gender: Yup.string().required("Gender is required").oneOf(["Male", "Female"]),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: FormikHelpers<typeof initialValues>) => {
    let didSucceed = false;

    try {
      // 1️⃣ Call your editUser thunk and unwrap the full payload
      const payload: ApiResponse<User> = await dispatch(editUser({ id: userId!, userData: values })).unwrap();

      // 2️⃣ Happy‐path first
      if (payload.success) {
        notifySuccess("User updated successfully");
        didSucceed = true;
      } else {
        // 3️⃣ Server‐side validation failed—throw into catch
        const errMsg = typeof payload.data === "string" ? payload.data : payload.message;
        throw new Error(errMsg);
      }
    } catch (err: any) {
      // 4️⃣ Both HTTP/network errors and server validation errors land here
      notifyError(err.message || "Failed to update user");
    } finally {
      // 5️⃣ Always reset the form, reload your user list, and close the modal
      resetForm();
      dispatch(fetchAllUsers());
      onClose();

      // 6️⃣ Only fire afterSubmit if we really succeeded
      if (didSucceed) {
        afterSubmit?.();
      }
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ setFieldValue, values }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <Field name="firstName" as={Input} placeholder="Enter first name" />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Last Name</label>
              <Field name="lastName" as={Input} placeholder="Enter last name" />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Email</label>
              <Field name="email" as={Input} placeholder="Enter email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Phone Number</label>
              <Field name="phoneNumber" as={Input} placeholder="Enter phone number" />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Gender</label>
              <Field name="gender">
                {({ field }: any) => (
                  <Select
                    {...field}
                    placeholder="Select gender"
                    className="w-full"
                    value={values.gender}
                    onChange={(val) => setFieldValue("gender", val)}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                  />
                )}
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Date of Birth</label>
              <DatePicker className="w-full" value={values.dateOfBirth ? dayjs(values.dateOfBirth) : undefined} onChange={(date) => setFieldValue("dateOfBirth", date?.format("YYYY-MM-DD"))} />
              <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Role Display (Fixed to Customer) */}
            <div>
              <label>Role</label>
              <Input value="Customer" disabled />
              <Field type="hidden" name="role" value={customerRoleId} />
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" type="primary" className="bg-blue-500 text-white">
              {isNewUser ? "Create Customer" : "Update Customer"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserFormik;
