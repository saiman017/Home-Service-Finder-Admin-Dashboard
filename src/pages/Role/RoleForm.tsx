import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addRole, updateRole, fetchAllRoles } from "../../store/slice/role";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";
import { Role } from "../../store/slice/role";

interface RoleFormProps {
  roleId?: string;
  isEditMode: boolean;
  initialData?: { id: string; name: string } | null;
  onClose: () => void;
  afterSubmit?: () => void;
}

interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T | string;
  message: string;
}

export default function RoleForm({ roleId, isEditMode, initialData, onClose, afterSubmit }: RoleFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues = { name: initialData?.name || "" };

  const validationSchema = Yup.object({
    name: Yup.string().required("Role name is required"),
  });

  const handleSubmit = async (values: { name: string }, { resetForm }: FormikHelpers<{ name: string }>) => {
    let didSucceed = false;

    try {
      const payload: ApiResponse<Role> = isEditMode && roleId ? await dispatch(updateRole({ id: roleId, name: values.name })).unwrap() : await dispatch(addRole({ name: values.name })).unwrap();

      // 2️⃣ “Happy path” first
      if (payload.success) {
        notifySuccess(isEditMode ? "Role updated successfully" : "Role added successfully");
        didSucceed = true;
      } else {
        const errMsg = typeof payload.data === "string" ? payload.data : payload.message;
        throw new Error(errMsg);
      }
    } catch (err: any) {
      notifyError(err.message || err.toString() || "Failed to save role");
    } finally {
      resetForm();
      dispatch(fetchAllRoles());
      onClose();
      if (didSucceed) {
        afterSubmit?.();
      }
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      <Form className="space-y-4">
        <div>
          <label>Role Name</label>
          <Field name="name" as={Input} placeholder="Enter role name" />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" type="primary">
            {isEditMode ? "Update Role" : "Add Role"}
          </Button>
        </div>
      </Form>
    </Formik>
  );
}
