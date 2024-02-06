import { useState } from "react";
import axios from "axios";

const DynamicForm = () => {
  const [form, setForm] = useState({ title: "", description: "", labels: [] });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddLabelClick = () => {
    setForm({ ...form, labels: [...form.labels, { name: "" }] });
  };

  const handleRemoveLabelClick = (index) => {
    const newLabels = [...form.labels];
    newLabels.splice(index, 1);
    setForm({ ...form, labels: newLabels });
  };

  const handleLabelInputChange = (e, index) => {
    const { name, value } = e.target;
    const newLabels = [...form.labels];
    newLabels[index][name] = value;
    setForm({ ...form, labels: newLabels });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the server using Axios
      await axios.post("http://localhost:5000/forms", form);

      // Optionally, you can reset the form after a successful submission
      setForm({ title: "", description: "", labels: [] });

      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <h1>Build Dynamic Form</h1>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                autoComplete="title"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Title"
                value={form.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                type="text"
                autoComplete="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {form.labels.map((label, index) => (
            <div key={index} className="mt-3">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter label name"
                    value={label.name}
                    onChange={(e) => handleLabelInputChange(e, index)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveLabelClick(index)}
                  className="text-red-500 text-sm mt-2 hover:text-red-600"
                >
                  Remove label
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={handleAddLabelClick}
              className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Label
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
