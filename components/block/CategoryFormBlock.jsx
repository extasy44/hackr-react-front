const CategoryFormBlock = ({ categories, loadedCategories, onClick }) => {
  if (!loadedCategories) null;
  return (
    loadedCategories &&
    loadedCategories.map((category) => (
      <li className="list-unstyled" key={category._id}>
        <input
          type="checkbox"
          onChange={onClick(category._id)}
          className="mr-2"
          checked={categories.includes(category._id)}
        />
        <label className="form-check-label">{category.name}</label>
      </li>
    ))
  );
};

export default CategoryFormBlock;
