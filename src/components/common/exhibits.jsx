import "../components.css";

function Exhibits({ exhibitID, changeHandler, exhibitOptions, isRequired }) {
  return (
    <div className="form-group">
      <label className={isRequired ? "required" : ""} htmlFor="exhibitID">
        Exhibit Name (ID)
      </label>
      <select
        id="exhibitID"
        value={exhibitID}
        onChange={changeHandler}
        required={isRequired}
      >
        <option value="" disabled selected>
          Select your option
        </option>
        {exhibitOptions.map((exhibit, index) => (
          <option id={index} value={exhibit.id}>
            {`${exhibit.name} (${exhibit.id})`}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ExhibitsRequired({ exhibitID, changeHandler, exhibitOptions }) {
  return (
    <Exhibits
      exhibitID={exhibitID}
      changeHandler={changeHandler}
      exhibitOptions={exhibitOptions}
      isRequired={true}
    />
  );
}

export function ExhibitsOptional({ exhibitID, changeHandler, exhibitOptions }) {
  return (
    <Exhibits
      exhibitID={exhibitID}
      changeHandler={changeHandler}
      exhibitOptions={exhibitOptions}
      isRequired={false}
    />
  );
}
