import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { VictoryChart, VictoryScatter } from 'victory';

const DEFAULT_POINT_SIZE = 3;
const BIG_POINT_SIZE = 5;

const FOCUSED_POINT = Object.freeze({
  stroke: 'rgb(71, 84, 102)',
  strokeWidth: 1,
});
const NORMAL_POINT = Object.freeze({ stroke: 'transparent', strokeWidth: 0 });

function App() {
  const [externalMutations, setExternalMutations] = useState(undefined);

  return (
    <div>
      <VictoryChart
        domain={{ y: [0, 6] }}
        height={200}
        style={{
          parent: {
            maxWidth: '50%',
          },
        }}>
        <VictoryScatter
          style={{ data: { fill: 'red' }, labels: { fill: 'red' } }}
          data={[
            { x: 0, y: 2 },
            { x: 2, y: 3 },
            { x: 4, y: 4 },
            { x: 6, y: 5 },
          ]}
          externalEventMutations={externalMutations}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      mutation: ({ index, size }) => {
                        const selected = size === BIG_POINT_SIZE;

                        // trigger event to the other points and other charts
                        setExternalMutations([
                          {
                            target: 'data',
                            eventKey: 'all',
                            mutation: (props) => {
                              if (index === props.index && !selected) {
                                return {
                                  size: BIG_POINT_SIZE,
                                  style: { ...props.style, ...FOCUSED_POINT },
                                };
                              }
                              return {
                                size: DEFAULT_POINT_SIZE,
                                style: { ...props.style, ...NORMAL_POINT },
                              };
                            },
                            callback: () => {
                              setExternalMutations(undefined);
                            },
                          },
                        ]);
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
