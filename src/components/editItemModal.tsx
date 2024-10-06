import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const EditItemModal = ({showModal, setShowModal, currentRecord, setCurrentRecord, handleSave} : any) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={currentRecord?.name}
              onChange={(e) => setCurrentRecord({ ...currentRecord, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={currentRecord?.email}
              onChange={(e) => setCurrentRecord({ ...currentRecord, email: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditItemModal