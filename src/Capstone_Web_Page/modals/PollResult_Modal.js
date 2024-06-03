import React from 'react';
import Modal from 'react-modal';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6384',
  '#36A2EB',
];

Modal.setAppElement('#root'); // Your app element

const PollResultModal = ({
  show,
  handleClose,
  pollResult,
}) => {
  const generateChartData = (counts, names) => {
    return Object.keys(names).map((key) => {
      const count = Object.values(counts[key]).reduce(
        (acc, value) => acc + value,
        0
      );
      return { name: names[key], value: count };
    });
  };

  const renderGenderCounts = () => {
    return Object.keys(pollResult.choiceGenderCounts).map(
      (key) => {
        const genderCounts =
          pollResult.choiceGenderCounts[key];
        return (
          <div key={key}>
            <strong>{pollResult.choiceName[key]}</strong>:
            {Object.keys(genderCounts).map((gender) => (
              <span key={gender}>
                {' '}
                {gender}: {genderCounts[gender]}{' '}
              </span>
            ))}
          </div>
        );
      }
    );
  };

  const renderAgeCounts = () => {
    return Object.keys(pollResult.choiceAgeCounts).map(
      (key) => {
        const ageCounts = pollResult.choiceAgeCounts[key];
        return (
          <div key={key}>
            <strong>{pollResult.choiceName[key]}</strong>:
            {Object.keys(ageCounts).map((ageGroup) => (
              <span key={ageGroup}>
                {' '}
                {ageGroup}: {ageCounts[ageGroup]}{' '}
              </span>
            ))}
          </div>
        );
      }
    );
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      contentLabel="Poll Result"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80%',
        },
      }}
    >
      <h2>Poll Result</h2>
      <button
        onClick={handleClose}
        style={{ float: 'right' }}
      >
        Close
      </button>
      {pollResult && (
        <>
          <h5>Gender Distribution</h5>
          <PieChart width={400} height={400}>
            <Pie
              data={generateChartData(
                pollResult.choiceGenderCounts,
                pollResult.choiceName
              )}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
            >
              {generateChartData(
                pollResult.choiceGenderCounts,
                pollResult.choiceName
              ).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>{renderGenderCounts()}</div>

          <h5>Age Distribution</h5>
          <PieChart width={400} height={400}>
            <Pie
              data={generateChartData(
                pollResult.choiceAgeCounts,
                pollResult.choiceName
              )}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#82ca9d"
            >
              {generateChartData(
                pollResult.choiceAgeCounts,
                pollResult.choiceName
              ).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>{renderAgeCounts()}</div>
        </>
      )}
    </Modal>
  );
};

export default PollResultModal;
