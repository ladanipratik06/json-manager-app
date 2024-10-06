import React from 'react'
import DataTable from 'react-data-table-component'

const ListTable = ({ columns, filteredRecords, filterText, setFilterText }: any) => {

  return (
    <div className='mt-3'>
      {filteredRecords?.length ?
        <input
          type="text"
          placeholder="Search by name or email"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: '10px' }}
          className="form-control"
        />
        : null
      }

      <DataTable
        columns={columns}
        data={filteredRecords}
        pagination
        highlightOnHover
        striped
      />
    </div>
  )
}

export default ListTable
