import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { FormGroup } from 'react-bootstrap';

const NumberInputWithChoice = ({label, max, min, options, onValueChange, values}) => {  
  const isDebutant = values.option === 'Debutant';
  if(label === "Expérience"){
    return (
        <FormGroup controlId="combinedInput">
          <Form.Label style={{ marginLeft: '20px' }}>{label}</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="number"
              name="number"
              min={min}
              max={max}
              value={values.value}
              onChange={(e) => {
                if (!isDebutant) {
                  onValueChange({ value: e.target.value, option: values.option });
                }
              }}
              className={`form-control mt-1 ${isDebutant ? 'disabled' : ''}`}
              disabled={isDebutant}
            />
            <Form.Control
              as="select"
              name="choice"
              value={values.option}
              onChange={(e) => {
                if (e.target.value === 'Debutant')
                  onValueChange({ value: 0, option: e.target.value });
                else  
                  onValueChange({ value: values.value, option: e.target.value });
              }}
              className="form-control mt-1"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </div>
        </FormGroup>
     );
  }else if(label === "Durée de l'offre"){
    const isMonth = values.option === 'mois';
    return (  
      <FormGroup controlId="combinedInput">
        <Form.Label style={{marginLeft: '20px'}}> {label} </Form.Label>
        <div className="d-flex">
          <Form.Control
            type="number"
            name="number"
            min={min}
            max={isMonth ? 11 : max}
            value={values.value}
            onChange= {(e) => {
                  onValueChange({'value':e.target.value, 'option':values.option})
              }  
            }
            className='form-control mt-1'
          />
          <Form.Control
            as="select"
            name="choice"
            value={values.option}
            onChange={(e) => {
                  onValueChange({'value':values.value, 'option':e.target.value})
              }  
            }
            className='form-control mt-1'
          >
            { options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
          </Form.Control>
        </div>
      </FormGroup>
    );
  }else{
    return (
      <FormGroup controlId="combinedInput">
        <Form.Label style={{marginLeft: '20px'}}> {label} </Form.Label>
        <div className="d-flex">
          <Form.Control
            type="number"
            name="number"
            min={min}
            max={max}
            value={values.value}
            onChange= {(e) => {
                  onValueChange({'value':e.target.value, 'option':values.option})
              }  
            }
            className='form-control mt-1'
          />
          <Form.Control
            as="select"
            name="choice"
            value={values.option}
            onChange={(e) => {
                  onValueChange({'value':values.value, 'option':e.target.value})
              }  
            }
            className='form-control mt-1'
          >
            { options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
          </Form.Control>
        </div>
      </FormGroup>
    );
  }
};

export default NumberInputWithChoice;