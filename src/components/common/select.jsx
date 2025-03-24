function Option({ options }) {
  return options.map((field, index) => (
    <option id={index} value={field}>
      {field}
    </option>
  ));
}

function OptionFromDB({ options }) {
  return options.map((field, index) => (
    <option id={index} value={field.id}>
      {`${field.name} (${field.id})`}
    </option>
  ));
}

export function Select({
  id,
  field,
  formElem,
  isRequired,
  handler,
  isFromDB,
  options,
}) {
  const selectOptions = isFromDB ? (
    <OptionFromDB options={options} />
  ) : (
    <Option options={options} />
  );
  const className = isRequired ? "required" : "";
  return (
    <div className="form-group">
      <label className={className} htmlFor={id}>
        {isFromDB ? `${field} (ID)` : field}
      </label>
      <select id={id} value={formElem} onChange={handler} required={isRequired}>
        <option value="" disabled selected>
          Select your option
        </option>
        {selectOptions}
      </select>
    </div>
  );
}
