import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select, Button, DatePicker } from "antd";
import { AppDispatch, RootState } from "../../store/store";
import dayjs from "dayjs";
import { fetchAllRoles } from "../../store/slice/role";
import { fetchServiceCategories } from "../../store/slice/serviceCategory";
import { fetchServiceProviderById, updateServiceProvider, fetchAllServiceProviders } from "../../store/slice/serviceProvider";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface ServiceProvider {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  role: string;
  experience: number;
  personalDescription?: string;
  serviceCategoryId: string;
}
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T | string;
  message: string;
}

interface Props {
  providerId: string;
  onClose: () => void;
  afterSubmit?: () => void;
  initialData?: ServiceProvider | null;
}

const ServiceProviderFormik: React.FC<Props> = ({ providerId, onClose, afterSubmit, initialData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [providerData, setProviderData] = useState<ServiceProvider | null>(initialData || null);
  const [roleId, setRoleId] = useState<string>("");
  const categories = useSelector((state: RootState) => state.serviceCategory.categories);

  useEffect(() => {
    dispatch(fetchAllRoles())
      .unwrap()
      .then((roles) => {
        const role = roles.find((r: any) => r.name?.toLowerCase() === "serviceprovider");
        if (role) setRoleId(role.id);
      });

    dispatch(fetchServiceCategories());

    if (!initialData && providerId) {
      dispatch(fetchServiceProviderById(providerId))
        .unwrap()
        .then((data) => setProviderData(data))
        .catch(() => notifyError("Failed to fetch provider details"));
    } else if (initialData) {
      setProviderData(initialData);
    }
  }, [dispatch, providerId, initialData]);

  const initialValues = {
    firstName: providerData?.firstName || "",
    lastName: providerData?.lastName || "",
    email: providerData?.email || "",
    phoneNumber: providerData?.phoneNumber || "",
    gender: providerData?.gender || "",
    dateOfBirth: providerData?.dateOfBirth || "",
    experience: providerData?.experience || 0,
    personalDescription: providerData?.personalDescription || "",
    serviceCategoryId: providerData?.serviceCategoryId || "",
    role: providerData?.role || roleId || "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Z][a-z]*$/, "First name must start with a capital letter"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Z][a-z]*$/, "Last name must start with a capital letter"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Must be 10 digits")
      .required("Required"),
    gender: Yup.string().oneOf(["Male", "Female"]).required("Required"),
    dateOfBirth: Yup.string().required("Required"),
    experience: Yup.number().min(0).required("Required"),
    serviceCategoryId: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: FormikHelpers<typeof initialValues>) => {
    let didSucceed = false;

    try {
      const updateData = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };

      const payload: ApiResponse<ServiceProvider> = await dispatch(updateServiceProvider({ id: providerId, updateData })).unwrap();

      if (payload.success) {
        notifySuccess("Provider updated successfully");
        didSucceed = true;
      } else {
        // 3️⃣ server said success:false → throw to catch
        const errMsg = typeof payload.data === "string" ? payload.data : payload.message;
        throw new Error(errMsg);
      }
    } catch (err: any) {
      notifyError(err.message || "Failed to update provider");
    } finally {
      resetForm();
      dispatch(fetchAllServiceProviders());
      onClose();
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
              <Field name="phoneNumber" as={Input} placeholder="Enter phone" />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Gender</label>
              <Field name="gender">
                {({ field }: any) => (
                  <Select
                    {...field}
                    placeholder="Select gender"
                    value={values.gender}
                    className="w-full"
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

            <div>
              <label>Experience (years)</label>
              <Field name="experience" type="number" as={Input} />
              <ErrorMessage name="experience" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Service Category</label>
              <Field name="serviceCategoryId">
                {({ field }: any) => (
                  <Select
                    {...field}
                    placeholder="Select category"
                    className="w-full"
                    value={values.serviceCategoryId}
                    onChange={(val) => setFieldValue("serviceCategoryId", val)}
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                  />
                )}
              </Field>
              <ErrorMessage name="serviceCategoryId" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="col-span-2">
              <label>Personal Description</label>
              <Field name="personalDescription" as={Input.TextArea} rows={3} />
              <ErrorMessage name="personalDescription" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Role</label>
              <Input value="Service Provider" disabled />
              <Field type="hidden" name="role" value={roleId} />
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" type="primary" className="bg-blue-500 text-white">
              Update Provider
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ServiceProviderFormik;
