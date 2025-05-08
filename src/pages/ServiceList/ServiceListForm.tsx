import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { addServiceList, updateServiceList } from "../../store/slice/serviceList";
import { fetchServiceCategories } from "../../store/slice/serviceCategory";
import { notifySuccess, notifyError } from "../../Toastify/Toastify";

const { Option } = Select;

interface Props {
  isEditMode: boolean;
  serviceId?: string;
  initialData?: {
    id: string;
    name: string;
    serviceCategoryId: string;
  } | null;
  onClose: () => void;
  afterSubmit?: () => void;
}

interface FormValues {
  name: string;
  serviceCategoryId: string;
}

export default function ServiceListForm({ isEditMode, serviceId, initialData, onClose, afterSubmit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((s: RootState) => s.serviceCategory.categories);

  useEffect(() => {
    dispatch(fetchServiceCategories());
  }, [dispatch]);

  const initialValues: FormValues = {
    name: initialData?.name || "",
    serviceCategoryId: initialData?.serviceCategoryId || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Service name is required"),
    serviceCategoryId: Yup.string().required("Category is required"),
  });
  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const payload = {
        name: values.name,
        serviceCategoryId: values.serviceCategoryId,
      };
      if (isEditMode && serviceId) {
        await dispatch(updateServiceList({ id: serviceId, ...payload })).unwrap();
        notifySuccess("Service updated successfully");
      } else {
        await dispatch(addServiceList(payload)).unwrap();
        notifySuccess("Service added successfully");
      }
      resetForm();
      onClose();
      afterSubmit?.();
    } catch (err: any) {
      resetForm();
      onClose();
      notifyError(err || "Operation failed");
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ setFieldValue, values }) => (
        <Form className="space-y-4">
          <div>
            <label>Service Name</label>
            <Field name="name" as={Input} placeholder="Enter service name" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label>Category</label>
            <Select value={values.serviceCategoryId} onChange={(val) => setFieldValue("serviceCategoryId", val)} placeholder="Select a category" className="w-full">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <ErrorMessage name="serviceCategoryId" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              {isEditMode ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
