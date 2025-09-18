import { Card, Text } from '@grafana/ui';
import { getProperty, GrafanaVariable } from 'components/GrafanaVariables/variableUtils';
import React from 'react'
import './anonymityVisualization.css'

interface AnonymityVisualizationProps {
  k: GrafanaVariable;
  l: GrafanaVariable;
  delta: GrafanaVariable;
}

const COLORS = ['#e7e7e7ff', '#13c15cff', '#efebb4', '#8987aa', '#e396e7', '#07eb7a', '#56afb3', '#99bbcb', '#d40e86', '#7e795a', '#28f797', '#646970', '#1a552a', '#cbec49', '#4a380f', '#f75986']

function random(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const KBox: React.FC<{ k: number, l: number }> = ({ k, l }) => {

  return (
    <div className='av-k-box' style={{ height: 300, width: '100%' }}>
      <div className="av-k-box-wrapper">
        {Array(k).fill(null).map((_, i) => {

          const seed = (i + 1) * 1000 + k * 1000;
          const posX = random(seed)
          const posY = random(seed + 1);

          return (
            <div
              key={i}
              className='av-k-dot'
              style={{
                background: COLORS[i % Math.max(Math.min(l, COLORS.length), 1)],
                top: posX * 100 + "%",
                left: posY * 100 + "%"
              }}></div>
          )
        })}
      </div>
    </div>
  )
}


export const AnonymityVisualization: React.FC<AnonymityVisualizationProps> = (props) => {

  const k = Number(getProperty('value', props.k));
  const kMax = Number(getProperty('max', props.k));

  const l = Number(getProperty('value', props.l));
  const lMax = Number(getProperty('max', props.l));

  const delta = Number(getProperty('value', props.delta));
  const deltaMax = Number(getProperty('max', props.delta));


  return (
    <div className='av-container'>
      <Card>
        <Card.Heading>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='av-k-dot' style={{
              backgroundColor: COLORS[0],
              position: 'unset',
              width: 10,
              height: 10,
              marginRight: 4,
            }}></div>

            <Text color='primary' element='h5'>
              k-Anonymity
            </Text>
          </div>
        </Card.Heading>
        <Card.Description>
          <Text color='primary' element='p'>
            Ziel: Verhindern, dass einzelne Personen in einer veröffentlichten Datenbank eindeutig identifiziert werden können.
          </Text>
          <Text color='primary' element='p'>
            Prinzip: Ein Datensatz gilt als k-anonym, wenn jede Kombination von identifizierenden Merkmalen (Quasi-Identifikatoren) mindestens k-mal vorkommt.
          </Text>

        </Card.Description>
      </Card>

      <Card>
        <Card.Heading>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='av-k-dot' style={{
              backgroundColor: COLORS[1],
              position: 'unset',
              width: 10,
              height: 10,
              marginRight: 4,
            }}></div>

            <Text color='primary' element='h5'>
              l-Diversity
            </Text>
          </div>
        </Card.Heading>
        <Card.Description>
          <Text color='primary' element='p'>
            Problem: k-Anonymity reicht nicht immer. Auch wenn eine Gruppe von
            𝑘
            Personen existiert, könnte das sensible Attribut in allen Datensätzen gleich sein (z. B. alle haben HIV → Rückschluss trotzdem möglich).
          </Text>
          <Text color='primary' element='p'>
            Lösung: l-Diversity fordert zusätzlich, dass innerhalb jeder Gruppe mindestens l verschiedene Ausprägungen des sensiblen Attributs vorhanden sind.
          </Text>

        </Card.Description>
      </Card>
      <div className='av-row'>
        <KBox k={k} l={l}></KBox>
      </div>
    </div>
  )
}
