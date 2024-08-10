import React, { useState } from "react";
import useAddOrUpdateItem from "../../hooks/useAddOrUpdateItem";
import Alert from "../alert/Alert";
import { debounce } from "../../utils/debounce";

interface FormItem {
  name: string;
  category: string;
  price: string;
}

function InventoryForm() {
  const mutation = useAddOrUpdateItem();
  const defaultFormItem = {
    name: "",
    category: "",
    price: "",
  };

  const [formItem, setFormItem] = useState<FormItem>(defaultFormItem);
  const inputFields = ["name", "category", "price"];
  const [disableButton, setDisableButton] = useState(false);

  // Alert states
  const [alertMessage, setAlertMessage] = useState("");

  // Input field change
  const handleInputChange = (
    e: React.FormEvent<HTMLInputElement>,
    type: string
  ) => {
    // Price validation
    if (type === "price") {
      // Allow only numbers and a single decimal point
      const validPattern = /^-?\d*\.?\d*$/;
      if (!validPattern.test(e.currentTarget.value)) {
        return;
      }
      // Restrict to two decimal places
      const decimalIndex = e.currentTarget.value.indexOf(".");
      if (
        decimalIndex !== -1 &&
        e.currentTarget.value.length - decimalIndex > 3
      ) {
        return;
      }
    }
    setFormItem({ ...formItem, [type]: e.currentTarget.value });
  };

  // Submission and validation logic
  const handleSubmitClick = () => {
    if (!formItem.name) {
      handleAlertMessage("name");
      return;
    }
    if (!formItem.category) {
      handleAlertMessage("category");
      return;
    }
    if (!formItem.price) {
      handleAlertMessage("price");
      return;
    }
    setDisableButton(true);
    debouncedValidation();
  };

  const handleValidationSuccess = () => {
    setAlertMessage("");
    mutation.mutate({
      ...formItem,
      price: parseFloat(parseFloat(formItem.price).toFixed(2)),
    });
    setFormItem(defaultFormItem);
    setDisableButton(false);
  };

  const debouncedValidation = debounce(handleValidationSuccess, 2000);

  const handleAlertMessage = (validationError: string) => {
    switch (validationError) {
      case "name":
        setAlertMessage("Name field is empty");
        break;
      case "category":
        setAlertMessage("Category field is empty");
        break;
      case "price":
        setAlertMessage("Price field is empty");
        break;
    }
  };

  return (
    <div className="bg-white p-6 rounded-md flex flex-col shadow-md gap-5">
      <span className="text-sm font-semibold">
        Add or Update Inventory Item
      </span>
      {alertMessage && <Alert message={alertMessage} />}
      {inputFields.map((input) => {
        return (
          <div key={input}>
            <span className="capitalize text-sm">{input}</span>
            <input
              type="text"
              className="py-1 px-2 border-solid border-[1px] text-sm w-full mt-1 focus:outline-none"
              placeholder="Enter here"
              value={
                input === "name"
                  ? formItem.name
                  : input === "category"
                  ? formItem.category
                  : input === "price"
                  ? formItem.price
                  : ""
              }
              onChange={(e) => handleInputChange(e, input)}
            ></input>
          </div>
        );
      })}
      <button
        className="flex justify-center items-center p-3 bg-violet-600 mt-7 text-sm font-bold text-white enabled:hover:bg-violet-500 disabled:opacity-75"
        onClick={() => handleSubmitClick()}
        disabled={disableButton}
      >
        Add / Update
        {disableButton && (
          <div className="ml-2 bg-spinner-icon bg-no-repeat bg-contain h-4 w-4"></div>
        )}
      </button>
    </div>
  );
}

export default InventoryForm;
