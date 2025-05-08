import React, { useEffect, useState } from "react";
import { Table, ConfigProvider, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextField from "@mui/material/TextField";
import { Search } from "lucide-react";

// Define the data structure types
interface CategoryItem {
  type: string | number;
  category: string | number;
  highlight?: boolean;
  [key: string]: any; // Allow for additional properties
}

interface ProcessedCategory {
  key: string;
  category: string | number;
  highlight: boolean;
}

interface ProcessedDataItem {
  key: string | number;
  type: string | number;
  categories: ProcessedCategory[];
}

interface CategoryReusableTableProps {
  data: CategoryItem[];
  searchText: string;
  setSearchText: (value: string) => void;
  pageSize?: number;
  pagination?: boolean;
  mobileCardRender?: (item: ProcessedDataItem) => React.ReactNode;
}

const CategoryReusableTable: React.FC<CategoryReusableTableProps> = ({ data, searchText, setSearchText, pageSize = 10, pagination = true, mobileCardRender }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const update = (): void => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Process data to handle the category structure
  const processData = (rawData: CategoryItem[]): ProcessedDataItem[] => {
    const result: ProcessedDataItem[] = [];

    // Group by type
    const groupedByType: Record<string, CategoryItem[]> = {};
    rawData.forEach((item) => {
      const typeKey = String(item.type);
      if (!groupedByType[typeKey]) {
        groupedByType[typeKey] = [];
      }
      groupedByType[typeKey].push(item);
    });

    // Transform to the format needed for rendering
    Object.keys(groupedByType).forEach((type) => {
      const categories: ProcessedCategory[] = groupedByType[type].map((item) => ({
        key: `${type}-${item.category}`,
        category: item.category,
        highlight: item.highlight || false,
      }));

      result.push({
        key: type,
        type,
        categories,
      });
    });

    return result;
  };

  // Filter data based on search text
  const filtered = data.filter((item) => item.type?.toString().toLowerCase().includes(searchText.toLowerCase()) || item.category?.toString().toLowerCase().includes(searchText.toLowerCase()));

  const processedData = processData(filtered);

  // Define columns for the expanded view
  const expandedColumns: ColumnsType<ProcessedCategory> = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <div className={`py-2 px-4 ${record.highlight ? "bg-green-200" : ""}`} style={{ width: "100%" }}>
          {text}
        </div>
      ),
    },
  ];

  // Define columns for the main table
  const columns: ColumnsType<ProcessedDataItem> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "30%",
    },
  ];

  // Render expanded row with nested table
  const expandedRowRender = (record: ProcessedDataItem): React.ReactNode => {
    return <Table className="bg-white" columns={expandedColumns} dataSource={record.categories} pagination={false} showHeader={false} rowKey="key" />;
  };

  // Mobile card renderer
  const renderMobileCard = (item: ProcessedDataItem): React.ReactNode => {
    return (
      <Card key={item.key} className="mb-4">
        <div className="font-bold">{item.type}</div>
        <div className="mt-2">
          {item.categories.map((cat) => (
            <div key={cat.key} className={`py-2 ${cat.highlight ? "bg-green-200" : ""}`}>
              {cat.category}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="mb-4 md:mb-0">Showing {filtered.length} results</div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <TextField
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-60"
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                paddingLeft: "2.5rem",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3F63C7",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3F63C7",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Mobile Cards or Table */}
      {isMobile ? (
        <div className="space-y-4">{processedData.map((item) => (mobileCardRender ? mobileCardRender(item) : renderMobileCard(item)))}</div>
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#f0f2f5",
                headerColor: "#1d1d1d",
                borderColor: "#e8e8e8",
                rowHoverBg: "#f5f5f5",
              },
            },
          }}
        >
          <Table
            className="bg-white shadow-sm rounded-md overflow-hidden"
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandAllRows: true,
            }}
            dataSource={processedData}
            pagination={pagination ? { pageSize } : false}
            rowKey="key"
          />
        </ConfigProvider>
      )}
    </div>
  );
};

export default CategoryReusableTable;
// import React, { useEffect, useState } from "react";
// import { Table, ConfigProvider, Card, Popconfirm, Space } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import TextField from "@mui/material/TextField";
// import { Search } from "lucide-react";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// // Define raw item shape
// export interface CategoryItem {
//   type: string | number;
//   category: string | number;
//   highlight?: boolean;
//   [key: string]: any;
// }

// // Processed nested category for display
// export interface ProcessedCategory {
//   key: string;
//   category: string | number;
//   highlight: boolean;
// }

// // Processed top‑level row grouping categories under a type
// export interface ProcessedDataItem {
//   key: string | number;
//   type: string | number;
//   categories: ProcessedCategory[];
// }

// export interface CategoryReusableTableProps {
//   data: CategoryItem[];
//   searchText: string;
//   setSearchText: (value: string) => void;
//   pageSize?: number;
//   pagination?: boolean;
//   mobileCardRender?: (item: ProcessedDataItem) => React.ReactNode;
//   onEdit?: (item: ProcessedCategory) => void;
//   onDelete?: (item: ProcessedCategory) => void;
// }

// const CategoryReusableTable: React.FC<CategoryReusableTableProps> = ({ data, searchText, setSearchText, pageSize = 10, pagination = true, mobileCardRender, onEdit, onDelete }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const update = () => setIsMobile(window.innerWidth < 768);
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   // Group & transform raw data
//   const processData = (raw: CategoryItem[]): ProcessedDataItem[] => {
//     const grouped: Record<string, CategoryItem[]> = {};
//     raw.forEach((item) => {
//       const key = String(item.type);
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(item);
//     });

//     return Object.entries(grouped).map(([type, items]) => ({
//       key: type,
//       type,
//       categories: items.map((it) => ({
//         key: `${type}-${it.category}`,
//         category: it.category,
//         highlight: it.highlight ?? false,
//       })),
//     }));
//   };

//   // apply search filter
//   const filtered = data.filter((item) => item.type.toString().toLowerCase().includes(searchText.toLowerCase()) || item.category.toString().toLowerCase().includes(searchText.toLowerCase()));

//   const processed = processData(filtered);

//   // nested columns
//   const expandedColumns: ColumnsType<ProcessedCategory> = [
//     {
//       title: "Service",
//       dataIndex: "category",
//       key: "category",
//       render: (text, record) => <div className={record.highlight ? "bg-green-200 py-2 px-4" : "py-2 px-4"}>{text}</div>,
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: 120,
//       render: (_text, record) => (
//         <Space size="middle">
//           <EditOutlined onClick={() => onEdit?.(record)} style={{ cursor: "pointer", color: "#1890ff" }} />
//           <Popconfirm title="Sure to delete?" onConfirm={() => onDelete?.(record)}>
//             <DeleteOutlined style={{ cursor: "pointer", color: "#ff4d4f" }} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   // main columns
//   const columns: ColumnsType<ProcessedDataItem> = [
//     {
//       title: "Category",
//       dataIndex: "type",
//       key: "type",
//       width: "30%",
//     },
//   ];

//   const expandedRowRender = (record: ProcessedDataItem) => <Table columns={expandedColumns} dataSource={record.categories} pagination={false} showHeader={false} rowKey="key" />;

//   const renderMobileCard = (item: ProcessedDataItem) => (
//     <Card key={item.key} className="mb-4">
//       <div className="font-bold">{item.type}</div>
//       <div className="mt-2">
//         {item.categories.map((cat) => (
//           <div key={cat.key} className={cat.highlight ? "bg-green-200 py-2" : "py-2"}>
//             {cat.category}
//           </div>
//         ))}
//       </div>
//     </Card>
//   );

//   return (
//     <div className="w-full">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
//         <div className="mb-4 md:mb-0">Showing {filtered.length} results</div>
//         <div className="relative">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
//           <TextField
//             placeholder="Search..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="w-60"
//             sx={{
//               borderRadius: 2,
//               "& .MuiOutlinedInput-root": {
//                 paddingLeft: "2.5rem",
//                 "&:hover .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#3F63C7",
//                 },
//                 "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "#3F63C7",
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {isMobile ? (
//         <div className="space-y-4">{processed.map((item) => (mobileCardRender ? mobileCardRender(item) : renderMobileCard(item)))}</div>
//       ) : (
//         <ConfigProvider
//           theme={{
//             components: {
//               Table: {
//                 headerBg: "#f0f2f5",
//                 headerColor: "#1d1d1d",
//                 borderColor: "#e8e8e8",
//                 rowHoverBg: "#f5f5f5",
//               },
//             },
//           }}
//         >
//           <Table
//             className="bg-white shadow-sm rounded-md overflow-hidden"
//             columns={columns}
//             expandable={{ expandedRowRender, defaultExpandAllRows: true }}
//             dataSource={processed}
//             pagination={pagination ? { pageSize } : false}
//             rowKey="key"
//           />
//         </ConfigProvider>
//       )}
//     </div>
//   );
// };

// export default CategoryReusableTable;
