import FractionInput from "./FractionInput";
import { useState } from "react";
import * as Yup from "yup";

const FractionCounter = () => {
  const [errors, setErrors] = useState();
  const [data, setData] = useState([
    {
      id: 1,
      type: "PLASTIC",
      fraction: 10,
      isSelected: true,
      children: [
        {
          id: 2,
          type: "PLASTIC_BOTTLE",
          fraction: 50,
          isSelected: true,
        },
        {
          id: 3,
          type: "BOTTLE_CAP",
          fraction: 50,
          isSelected: true,
        },
      ],
    },
    {
      id: 4,
      type: "WOOD",
      fraction: 20,
      isSelected: true,
      children: [
        {
          id: 5,
          type: "WOOD_CHIPS",
          fraction: 90,
          isSelected: true,
        },
      ],
    },
    {
      id: 6,
      type: "GLASS",
      fraction: 0,
      isSelected: false,
      children: [],
    },
    {
      id: 7,
      type: "PAPER",
      fraction: 0,
      isSelected: false,
      children: [
        {
          id: 8,
          type: "CARDBOARD_BOX",
          fraction: 0,
          isSelected: false,
        },
      ],
    },
  ]);

  // Custom validation method for children fractions
  const childrenFractionValidation = (children) => {
    const totalChildrenFraction = (children || []).reduce(
      (sum, child) => sum + child.fraction,
      0,
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
            }),
          )
          .test(
            "children-fraction-test",
            "Total fraction of children should not exceed 100",
            childrenFractionValidation,
          ),
      }),
    )
    .test(
      "parent-fraction-test",
      "Total fraction of parents should not exceed 100",
      (items) => {
        const totalParentFraction = items.reduce(
          (sum, item) => sum + item.fraction,
          0,
        );
        return totalParentFraction <= 100;
      },
    );

  const validateData = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      console.log("Validation succeeded");
    } catch (err) {
      console.log(JSON.stringify(err));
      setErrors(err.inner);
      if (err.inner) {
        err.inner.forEach((error) => {
          console.error(
            `Validation error at path: ${error.path}, message: ${error.message}`,
          );
        });
      } else {
        console.error("Validation failed", err.errors);
      }
    }
  };

  const handleInputChange = ({ id, value, key }) => {
    let _data = data?.map((item) => {
      if (item.id == id) {
        item[key] = value;
      } else {
        item.children?.map((itemChild) => {
          if (itemChild.id == id) {
            itemChild[key] = value;
          } else {
            return itemChild;
          }
        });
      }
      return item;
    });
    validateData(_data);
    setData(_data);
  };

  return (
    <>
      {JSON.stringify(data)}
      <FractionInput data={data} onChange={handleInputChange} errors={errors} />
    </>
  );
};

export default FractionCounter;
