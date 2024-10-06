import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ListTable from "./components/listTable";
import EditItemModal from "./components/editItemModal";
import { Button } from "react-bootstrap";

interface Record {
  id: number;
  name: string;
  email: string;
}

const App = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null);
  const [filteredRecords, setFilterdRecords] = useState<Record[]>([]);
  const myDomain = ["example.com"];

  useEffect(() => {
    const savedRecords = localStorage.getItem("records");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (result) {
            const uploadedData: Record[] = JSON.parse(result);
            const filteredData = removeDuplicates(records, uploadedData);

            const validDomainData = filteredData.filter((item: Record) => {
              const email = item?.email;
              const emailDomain = email?.split("@")[1];
              return emailDomain === "example.com"
            });

            if (validDomainData.length !== filteredData.length) {
              alert("Some records were excluded due to invalid email domains.");
            }

            setRecords(validDomainData);
            localStorage.setItem("records", JSON.stringify(validDomainData));
          }
        } catch (error) {
          console.error("Error reading or parsing file", error);
          alert("Invalid JSON file");
        }
      };

      reader.readAsText(file);
    }
  };

  const removeDuplicates = (data: Record[], newData: Record[]) => {
    const existingEmails = new Set(data.map((item: Record) => item.email));

    if (data.length === 0) {
      const uniqueNewData = new Set();
      return newData.filter((item: Record) => {
        if (!uniqueNewData.has(item.email)) {
          uniqueNewData.add(item.email);
          return true;
        }
        return false;
      });
    } else {
      const filteredNewData = newData.filter(
        (item: Record) => !existingEmails.has(item.email)
      );

      return [...data, ...filteredNewData];
    }
  };

  const handleEdit = (index: Record) => {
    setCurrentRecord(index);
    setShowModal(true);
  };

  const handleDelete = (index: Record) => {
    const updatedRecords = records?.filter(
      (record: Record) => record?.email !== index?.email
    );
    setRecords(updatedRecords);
    localStorage.setItem("records", JSON.stringify(updatedRecords));
  };

  const handleSave = () => {
    if (currentRecord) {
      const email = currentRecord?.email; 

      if (email) {
        const emailDomain = email.split("@")[1]; 

        if (emailDomain !== "example.com") {
          alert("Error: The email domain must be the same as your domain.");
          return; 
        }
      } else {
        alert("Error: Email is required.");
        return;
      }

      const updatedRecords = records?.map((record) => {
        if (record?.id === currentRecord?.id) {
          return currentRecord;
        } else {
          return record;
        }
      });

      setRecords(updatedRecords);
      localStorage.setItem("records", JSON.stringify(updatedRecords));
      setShowModal(false);
    }
  };

  useEffect(() => {
    const updatedRecords = records.filter(
      (record: Record) =>
        record?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        record?.email?.toLowerCase().includes(filterText.toLowerCase())
    );

    setFilterdRecords(updatedRecords);
  }, [records, filterText]);

  const handleRemoveAll = () => {
    setRecords([]);
    localStorage.setItem("records", JSON.stringify([]));
  };

  const columns = [
    { name: "Id", selector: (row: Record) => row.id, sortable: true },
    { name: "Name", selector: (row: Record) => row.name, sortable: true },
    { name: "Email", selector: (row: Record) => row.email, sortable: true },
    {
      name: "Actions",
      cell: (index: Record) => (
        <>
          <FaEdit
            style={{ cursor: "pointer", marginRight: "10px", color: "blue" }}
            onClick={() => handleEdit(index)}
          />
          <FaTrash
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDelete(index)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h1>Upload JSON File</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />

      <div className="mt-5 d-flex justify-content-between w-100">
        <h2 className="">Stored Records</h2>
        {records?.length ? (
          <Button variant="danger" onClick={handleRemoveAll}>
            Remove All Records
          </Button>
        ) : null}
      </div>

      <div className="w-100">
        <ListTable
          columns={columns}
          filteredRecords={filteredRecords}
          filterText={filterText}
          setFilterText={setFilterText}
        />
      </div>

      <EditItemModal
        showModal={showModal}
        setShowModal={setShowModal}
        currentRecord={currentRecord}
        setCurrentRecord={setCurrentRecord}
        handleSave={handleSave}
      />
    </div>
  );
};

export default App;
