import React, { useEffect, useState } from "react";
import { Table, ConfigProvider, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextField from "@mui/material/TextField";

interface ReusableStyledTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  searchText: string;
  setSearchText: (value: string) => void;
  pageSize?: number;
  pagination?: boolean;
  mobileCardRender?: (item: T) => React.ReactNode;
}

export default function ReusableTable<T extends { key: React.Key }>({ data, columns, searchText, setSearchText, pageSize = 10, pagination = true, mobileCardRender }: ReusableStyledTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filtered = data.filter((item) => Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchText.toLowerCase())));

  const isOverflow = columns.length > 6;

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: { colorPrimary: "#3F63C7" },
        },
      }}
    >
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 hidden md:block">
            Showing <span className="text-[#3F63C7] font-semibold">{filtered.length}</span> results
          </p>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-60"
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
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

        {/* Mobile Cards or Table */}
        {isMobile && mobileCardRender ? (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <Card key={item.key} className="shadow border rounded-xl">
                {mobileCardRender(item)}
              </Card>
            ))}
          </div>
        ) : (
          <div className={`border rounded-xl overflow-hidden ${isOverflow ? "overflow-x-auto" : ""}`}>
            <Table
              columns={columns}
              dataSource={filtered}
              pagination={
                pagination
                  ? {
                      pageSize,
                      position: ["bottomRight"],
                      showSizeChanger: false,
                    }
                  : false
              }
              scroll={isOverflow ? { x: "max-content" } : undefined}
            />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
