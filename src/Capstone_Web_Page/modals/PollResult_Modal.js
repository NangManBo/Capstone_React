import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const PollResultModal = ({
  show,
  handleClose,
  pollResult,
}) => {
  const generateChartData = (counts, names) => {
    const labels = Object.keys(names).map(
      (key) => names[key]
    );
    const data = Object.keys(counts).map((key) => {
      const count = Object.values(counts[key]).reduce(
        (acc, value) => acc + value,
        0
      );
      return count;
    });

    return {
      labels: labels,
      datasets: [
        {
          label: '# of Votes',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Poll Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pollResult && (
          <>
            <Pie
              data={generateChartData(
                pollResult.choiceGenderCounts,
                pollResult.choiceName
              )}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
            <Pie
              data={generateChartData(
                pollResult.choiceAgeCounts,
                pollResult.choiceName
              )}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PollResultModal;
