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
  '#FFCD56',
  '#4BC0C0',
  '#9966FF',
  '#C9CBCF',
  '#4B4E6D',
  '#F07B3F',
  '#E94F37',
  '#5F4B8B',
  '#FF6F61',
  '#6B5B95',
  '#88B04B',
  '#F7CAC9',
  '#92A8D1',
  '#955251',
  '#B565A7',
  '#009B77',
];

Modal.setAppElement('#root'); // Your app element

const PollResultModal = ({
  show,
  handleClose,
  pollResult,
}) => {
  const usedColors = new Set();
  let colorIndex = 0;

  const getColor = () => {
    const color = COLORS[colorIndex % COLORS.length];
    colorIndex++;
    return color;
  };

  const generateChartData = (counts, names) => {
    return Object.keys(names).flatMap((key) => {
      return Object.keys(counts[key]).map((subKey) => {
        const count = counts[key][subKey];
        return {
          name: `${names[key]}: ${subKey}`,
          value: count,
        };
      });
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
                  fill={getColor()}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>{renderGenderCounts()}</div>
          {usedColors.clear()}{' '}
          {/* Reset used colors for the next chart */}
          colorIndex = 0;{' '}
          {/* Reset color index for the next chart */}
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
                  fill={getColor()}
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
