// import { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
// import { Input, Button, Upload } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import * as Yup from "yup";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../store/store";
// import { addServiceCategory, ServiceCategory, updateServiceCategory } from "../../store/slice/serviceCategory";
// import { notifySuccess, notifyError } from "../../Toastify/Toastify";

// interface Props {
//   isEditMode: boolean;
//   categoryId?: string;
//   initialData?: {
//     id: string;
//     name: string;
//     description: string;
//     categoryImage?: string;
//   } | null;
//   onClose: () => void;
//   afterSubmit?: () => void;
// }

// interface FormValues {
//   name: string;
//   description: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   code: number;
//   data: T | null;
//   message: string;
// }

// export default function ServiceCategoryForm({ isEditMode, categoryId, initialData, onClose, afterSubmit }: Props) {
//   const dispatch = useDispatch<AppDispatch>();
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData?.categoryImage);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isEditMode) {
//       setPreviewUrl(initialData?.categoryImage);
//     } else {
//       setPreviewUrl(undefined);
//       setFile(null);
//     }
//   }, [isEditMode, initialData]);

//   const initialValues: FormValues = {
//     name: initialData?.name || "",
//     description: initialData?.description || "",
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Name is required"),
//     description: Yup.string().required("Description is required"),
//   });

//   const beforeUpload = (file: File) => {
//     setFile(file);
//     const reader = new FileReader();
//     reader.onload = () => setPreviewUrl(reader.result as string);
//     reader.readAsDataURL(file);
//     return false; // prevent automatic upload
//   };

//   const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
//     setLoading(true);
//     let didSucceed = false;

//     try {
//       // build payload
//       const payloadData: any = { name: values.name, description: values.description };
//       if (file) payloadData.categoryImageFile = file;

//       // dispatch and unwrap full ApiResponse
//       const response: ApiResponse<ServiceCategory> =
//         isEditMode && categoryId ? await dispatch(updateServiceCategory({ id: categoryId, ...payloadData })).unwrap() : await dispatch(addServiceCategory(payloadData)).unwrap();

//       if (response.success) {
//         notifySuccess(isEditMode ? "Category updated successfully" : "Category added successfully");
//         didSucceed = true;
//       } else {
//         // server-side validation or business error
//         throw new Error(response.message || "Operation failed");
//       }
//     } catch (err: any) {
//       notifyError(err.message || "Operation failed");
//     } finally {
//       resetForm();
//       setFile(null);
//       setPreviewUrl(undefined);
//       setLoading(false);
//       onClose();
//       if (didSucceed) afterSubmit?.();
//     }
//   };

//   return (
//     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
//       {() => (
//         <Form className="space-y-4">
//           <div>
//             <label>Name</label>
//             <Field name="name" as={Input} placeholder="Name" />
//             <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
//           </div>

//           <div>
//             <label>Description</label>
//             <Field name="description" as={Input.TextArea} rows={4} placeholder="Description" />
//             <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
//           </div>

//           <div>
//             <label>Image (optional)</label>
//             <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*" disabled={loading}>
//               <Button icon={<UploadOutlined />} loading={loading}>
//                 {loading ? "Processing..." : "Select Image"}
//               </Button>
//             </Upload>
//             {previewUrl && <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />}
//           </div>

//           <div className="flex justify-end gap-4 mt-6">
//             <Button onClick={onClose} disabled={loading}>
//               Cancel
//             </Button>
//             <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
//               {isEditMode ? "Update Category" : "Add Category"}
//             </Button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// }
// components/ServiceCategoryForm.tsx
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addServiceCategory, updateServiceCategory, ServiceCategory, ApiResponse } from "../../store/slice/serviceCategory";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

interface Props {
  isEditMode: boolean;
  categoryId?: string;
  initialData?: Partial<ServiceCategory> | null;
  onClose: () => void;
  afterSubmit?: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export default function ServiceCategoryForm({ isEditMode, categoryId, initialData, onClose, afterSubmit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.categoryImage);
  const [loading, setLoading] = useState(false);

  const initialValues: FormValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const beforeUpload = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(f);
    return false;
  };

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    setLoading(true);
    let didSucceed = false;
    try {
      const payload: any = { name: values.name, description: values.description };
      if (file) payload.categoryImageFile = file;

      const response: ApiResponse<ServiceCategory> =
        isEditMode && categoryId ? await dispatch(updateServiceCategory({ id: categoryId, ...payload })).unwrap() : await dispatch(addServiceCategory(payload)).unwrap();

      if (response.success && response.data) {
        notifySuccess(isEditMode ? "Category updated successfully" : "Category added successfully");
        didSucceed = true;
      } else {
        const errMsg = typeof response.data === "string" ? response.data : response.message;
        throw new Error(errMsg);
      }
    } catch (err: any) {
      notifyError(err.message || err.toString() || "Failed to save service catgeory");
    } finally {
      resetForm();
      setFile(null);
      setPreviewUrl(undefined);
      setLoading(false);
      onClose();
      if (didSucceed) afterSubmit?.();
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {() => (
        <Form className="space-y-4">
          <div>
            <label>Name</label>
            <Field name="name" as={Input} placeholder="Name" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Description</label>
            <Field name="description" as={Input.TextArea} rows={4} placeholder="Description" />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label>Image (optional)</label>
            <Upload beforeUpload={beforeUpload} showUploadList={false} disabled={loading}>
              <Button icon={<UploadOutlined />} loading={loading}>
                {loading ? "Processing..." : "Select Image"}
              </Button>
            </Upload>
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={loading} disabled={loading}>
              {isEditMode ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
