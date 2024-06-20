const FractionInput = ({ data, onChange }) => {
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      onChange({
        id: e.target.getAttribute("data-id"),
        value: true,
        key: "isSelected",
      });
    }
    onChange({
      id: e.target.getAttribute("data-id"),
      value,
      key: "fraction",
    });
  };

  const handleInputSelect = (e) => {
    if (!e.target.checked) {
      onChange({
        id: e.target.getAttribute("data-id"),
        value: 0,
        key: "fraction",
      });
    }
    onChange({
      id: e.target.getAttribute("data-id"),
      value: e.target.checked,
      key: "isSelected",
    });
  };

  return (
    <>
      {data?.map((item) => (
        <div key={item.id}>
          <Input
            item={item}
            handleInputSelect={handleInputSelect}
            handleInputChange={handleInputChange}
          />
          {item?.children?.map((itemChild) => (
            <Input
              key={itemChild.id}
              className="input-child"
              item={itemChild}
              handleInputSelect={handleInputSelect}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default FractionInput;

const Input = ({ item, handleInputSelect, handleInputChange, className }) => {
  return (
    <fieldset className={className ?? "input"}>
      <input
        type="checkbox"
        data-id={item.id}
        checked={item.isSelected}
        onChange={handleInputSelect}
      />
      <label htmlFor={item.id}>{item.type}</label>
      <input
        data-id={item.id}
        type="number"
        value={item.fraction}
        onChange={handleInputChange}
      />
    </fieldset>
  );
};
