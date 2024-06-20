import FractionInput from "./FractionInput";
import { useState } from "react";
import * as Yup from "yup";

const FractionCounter = () => {
  const [data, setData] = useState([
    {
      id: 1,
      type: "PLASTIC",
      fraction: 10,
      isSelected: true,
      children: [
        {
          id: 12,
          type: "PLASTIC_BOTTLE",
          fraction: 50,
          isSelected: true,
        },
        {
          id: 2,
          type: "BOTTLE_CAP",
          fraction: 50,
          isSelected: true,
        },
      ],
    },
    {
      id: 2,
      type: "WOOD",
      fraction: 20,
      isSelected: true,
      children: [
        {
          id: 13,
          type: "WOOD_CHIPS",
          fraction: 90,
          isSelected: true,
        },
      ],
    },
    {
      id: 3,
      type: "GLASS",
      fraction: 0,
      isSelected: false,
      children: [],
    },
  ]);

  // Custom validation method for children fractions
  const childrenFractionValidation = (children) => {
    const totalChildrenFraction = (children || []).reduce(
      (sum, child) => sum + child.fraction,
      0
    );
    return totalChildrenFraction <= 100;
  };

  // Yup validation schema
  const schema = Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        type: Yup.string().required(),
        fraction: Yup.number().required().min(0).max(100),
        children: Yup.array()
          .of(
            Yup.object().shape({
              id: Yup.number().required(),
              type: Yup.string().required(),
              fraction: Yup.number().required().min(0).max(100),
            })
          )
          .test(
            "children-fraction-test",
            "Total fraction of children should not exceed 100",
            childrenFractionValidation
          ),
      })
    )
    .test(
      "parent-fraction-test",
      "Total fraction of parents should not exceed 100",
      (items) => {
        const totalParentFraction = items.reduce(
          (sum, item) => sum + item.fraction,
          0
        );
        return totalParentFraction <= 100;
      }
    );

  const validateData = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      console.log("Validation succeeded");
    } catch (err) {
      console.error("Validation failed", err.errors);
    }
  };

  const handleInputChange = ({ id, value, key }) => {
    let _data = data?.map((item) => {
      if (item.id == id) {
        item[key] = value;
      }
      return item;
    });
    console.log("_data", _data);
    validateData(data).then(() => setData(_data));
  };

  return (
    <>
      {JSON.stringify(data)}
      <FractionInput data={data} onChange={handleInputChange} />
    </>
  );
};

export default FractionCounter;
