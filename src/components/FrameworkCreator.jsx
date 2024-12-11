import React, { useState, useEffect } from 'react'
import './FrameworkCreator.css'

function FrameworkCreator({ onSave, onCancel, initialData }) {
  const [frameworkName, setFrameworkName] = useState('')
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState({ name: '', color: '#1F77B4' })
  const [currentType, setCurrentType] = useState({ title: '', description: '' })
  const [currentSubtype, setCurrentSubtype] = useState({ title: '', description: '' })
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null)
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFrameworkName(initialData.name)
      setCategories(initialData.categories || [])
    }
  }, [initialData])

  const handleAddCategory = () => {
    if (currentCategory.name) {
      setCategories([...categories, { 
        ...currentCategory, 
        types: [] 
      }])
      setCurrentCategory({ name: '', color: '#1F77B4' })
    }
  }

  const handleUpdateCategory = (index, updatedCategory) => {
    const newCategories = [...categories]
    newCategories[index] = { ...newCategories[index], ...updatedCategory }
    setCategories(newCategories)
  }

  const handleDeleteCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index)
    setCategories(newCategories)
    if (selectedCategoryIndex === index) {
      setSelectedCategoryIndex(null)
      setSelectedTypeIndex(null)
    }
  }

  const handleAddType = () => {
    if (currentType.title && selectedCategoryIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types) {
        updatedCategories[selectedCategoryIndex].types = []
      }
      const newType = {
        ...currentType,
        id: Date.now().toString(),
        subtypes: []
      }
      updatedCategories[selectedCategoryIndex].types.push(newType)
      setCategories(updatedCategories)
      setCurrentType({ title: '', description: '' })
    }
  }

  const handleUpdateType = (categoryIndex, typeIndex, updatedType) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].types[typeIndex] = {
      ...newCategories[categoryIndex].types[typeIndex],
      ...updatedType
    }
    setCategories(newCategories)
  }

  const handleDeleteType = (categoryIndex, typeIndex) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].types = newCategories[categoryIndex].types.filter((_, i) => i !== typeIndex)
    setCategories(newCategories)
    if (selectedTypeIndex === typeIndex) {
      setSelectedTypeIndex(null)
    }
  }

  const handleAddSubtype = () => {
    if (currentSubtype.title && selectedCategoryIndex !== null && selectedTypeIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes) {
        updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes = []
      }
      updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes.push({
        ...currentSubtype,
        id: Date.now().toString()
      })
      setCategories(updatedCategories)
      setCurrentSubtype({ title: '', description: '' })
    }
  }

  const handleUpdateSubtype = (categoryIndex, typeIndex, subtypeIndex, updatedSubtype) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].types[typeIndex].subtypes[subtypeIndex] = {
      ...newCategories[categoryIndex].types[typeIndex].subtypes[subtypeIndex],
      ...updatedSubtype
    }
    setCategories(newCategories)
  }

  const handleDeleteSubtype = (categoryIndex, typeIndex, subtypeIndex) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].types[typeIndex].subtypes = 
      newCategories[categoryIndex].types[typeIndex].subtypes.filter((_, i) => i !== subtypeIndex)
    setCategories(newCategories)
  }

  const handleSave = () => {
    if (frameworkName && categories.length > 0) {
      const framework = {
        id: initialData?.id,
        name: frameworkName,
        categories: categories
      }
      onSave(framework)
    }
  }

  return (
    <div className="framework-creator">
      <h2>{initialData ? 'Edit Framework' : 'Create New Framework'}</h2>
      
      <div className="section">
        <h3>Framework Name</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={frameworkName} 
            onChange={(e) => setFrameworkName(e.target.value)} 
            placeholder="Enter framework name" 
            className="framework-name-input"
          />
        </div>
      </div>

      <div className="section">
        <h3>Categories</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentCategory.name} 
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} 
            placeholder="Category name" 
          />
          <div className="color-picker">
            <label>Category Color:</label>
            <input 
              type="color" 
              value={currentCategory.color} 
              onChange={(e) => setCurrentCategory({ ...currentCategory, color: e.target.value })} 
            />
          </div>
          <button 
            onClick={handleAddCategory}
            disabled={!currentCategory.name.trim()}
            className="add-button"
          >
            Add Category
          </button>
        </div>
        <div className="preview">
          <ul>
            {categories.map((cat, index) => (
              <li 
                key={index} 
                className="category-item"
              >
                <div 
                  className="category-header"
                  onClick={() => setSelectedCategoryIndex(index)}
                  style={{ 
                    backgroundColor: selectedCategoryIndex === index ? '#f0f0f0' : 'transparent',
                    borderLeft: `4px solid ${cat.color}`
                  }}
                >
                  <span>{cat.name}</span>
                  <div className="category-actions">
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentCategory({ name: cat.name, color: cat.color })
                        handleUpdateCategory(index, { name: cat.name, color: cat.color })
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCategory(index)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Types</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentType.title} 
            onChange={(e) => setCurrentType({ ...currentType, title: e.target.value })} 
            placeholder="Type title" 
            disabled={selectedCategoryIndex === null}
          />
          <textarea 
            value={currentType.description} 
            onChange={(e) => setCurrentType({ ...currentType, description: e.target.value })} 
            placeholder="Type description" 
            disabled={selectedCategoryIndex === null}
          />
          <button 
            onClick={handleAddType}
            disabled={!currentType.title.trim() || selectedCategoryIndex === null}
            className="add-button"
          >
            Add Type
          </button>
        </div>
        <div className="preview">
          <ul>
            {selectedCategoryIndex !== null && categories[selectedCategoryIndex].types?.map((type, index) => (
              <li 
                key={index}
                className="type-item"
              >
                <div 
                  className="type-header"
                  onClick={() => setSelectedTypeIndex(index)}
                  style={{ 
                    backgroundColor: selectedTypeIndex === index ? '#f0f0f0' : 'transparent'
                  }}
                >
                  <span>{type.title}</span>
                  <div className="type-actions">
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentType({ title: type.title, description: type.description })
                        handleUpdateType(selectedCategoryIndex, index, { 
                          title: type.title, 
                          description: type.description 
                        })
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteType(selectedCategoryIndex, index)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Subtypes</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentSubtype.title} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, title: e.target.value })} 
            placeholder="Subtype title" 
            disabled={selectedTypeIndex === null}
          />
          <textarea 
            value={currentSubtype.description} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, description: e.target.value })} 
            placeholder="Subtype description" 
            disabled={selectedTypeIndex === null}
          />
          <button 
            onClick={handleAddSubtype}
            disabled={!currentSubtype.title.trim() || selectedTypeIndex === null}
            className="add-button"
          >
            Add Subtype
          </button>
        </div>
        <div className="preview">
          <ul>
            {selectedTypeIndex !== null && 
             categories[selectedCategoryIndex]?.types[selectedTypeIndex]?.subtypes?.map((subtype, index) => (
              <li key={index} className="subtype-item">
                <div className="subtype-header">
                  <span>{subtype.title}</span>
                  <div className="subtype-actions">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setCurrentSubtype({ title: subtype.title, description: subtype.description })
                        handleUpdateSubtype(selectedCategoryIndex, selectedTypeIndex, index, {
                          title: subtype.title,
                          description: subtype.description
                        })
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSubtype(selectedCategoryIndex, selectedTypeIndex, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleSave}
          disabled={!frameworkName.trim() || categories.length === 0}
          className="save"
        >
          {initialData ? 'Save Changes' : 'Save Framework'}
        </button>
        <button onClick={onCancel} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default FrameworkCreator
