import Ajv from "ajv";

const baseUrl = 'http://localhost:5000/steps';
// const baseUrl = 'http://localhost:3004/step1';

export interface ITypes {
  key: string,
  x:   number,
  y:   number,
}

const schema = {
  type: "array",
  "items": { "$ref": "#/$defs/ITypes" },
  "$defs": {
    "ITypes": {
      type: "object",
      properties: {
        key: { type: "string" },
        x:   { type: "number" },
        y:   { type: "number" },
      } ,
      required: ['key', 'x', 'y']
    }
  }
}

const ajv = new Ajv();
const validate = ajv.compile({...schema});

const Obj = { baseUrl, schema, validate }

export default Obj;