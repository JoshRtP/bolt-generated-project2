import React, { useState, useEffect } from 'react'
import { innovationTypes } from './innovationData'
import './App.css'
import FrameworkCreator from './components/FrameworkCreator'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeTypes, setActiveTypes] = useState(new Set())
  const [showAll, setShowAll] = useState(true)
  const [selectedFramework, setSelectedFramework] = useState(null)
  const [frameworks, setFrameworks] = useState([])
  const [isCreatingFramework, setIsCreatingFramework] = useState(false)

  const defaultCategories = {
    'Configuration': {
      color: '#1F77B4',
      types: innovationTypes.filter(type => type.category === 'Configuration')
    },
    'Offering': {
      color: '#FF7F0E',
      types: innovationTypes.filter(type => type.category === 'Offering')
    },
    'Experience': {
      color: '#2CA02C',
      types: innovationTypes.filter(type => type.category === 'Experience')
    }
  }

  const frameworksStorageKey = 'innovation-frameworks'

  useEffect(() => {
    const storedFrameworks = localStorage.getItem(frameworksStorageKey)
    const defaultFramework = {
      id: 'default',
      name: '10 Types of Innovation',
      isDefault: true,
      categories: defaultCategories
    }

    if (storedFrameworks) {
      const parsedFrameworks = JSON.parse(storedFrameworks)
      setFrameworks([defaultFramework, ...parsedFrameworks.filter(f => f.id !== 'default')])
    } else {
      setFrameworks([defaultFramework])
    }
  }, [])

  useEffect(() => {
    if (frameworks.length > 0) {
      localStorage.setItem(frameworksStorageKey, JSON.stringify(frameworks))
    }
  }, [frameworks])

  const categories = selectedFramework?.categories || defaultCategories

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setActiveTypes(new Set())
      setShowAll(true)
    } else {
      setSelectedCategory(category)
      setActiveTypes(new Set(categories[category].types.map(type => type.id)))
      setShowAll(true)
    }
  }

  const handleTypeClick = (typeId) => {
    setShowAll(false)
    setActiveTypes(new Set([typeId]))
  }

  const handleShowAllClick = () => {
    setShowAll(true)
    if (selectedCategory) {
      setActiveTypes(new Set(categories[selectedCategory].types.map(type => type.id)))
    }
  }

  const handleCreateFramework = () => {
    setIsCreatingFramework(true)
    setSelectedFramework(null)
  }

  const handleSaveFramework = (framework) => {
    if (framework.id) {
      // Edit existing framework
      setFrameworks(frameworks.map(f => f.id === framework.id ? framework : f))
    } else {
      // Create new framework
      const newFramework = { ...framework, id: Date.now().toString() }
      setFrameworks([...frameworks, newFramework])
      setSelectedFramework(newFramework)
    }
    setIsCreatingFramework(false)
  }

  const handleFrameworkChange = (e) => {
    const frameworkId = e.target.value
    if (!frameworkId) {
      setSelectedFramework(null)
      return
    }
    const framework = frameworks.find(f => f.id === frameworkId)
    setSelectedFramework(framework)
  }

  const handleEditFramework = () => {
    if (selectedFramework && !selectedFramework.isDefault) {
      setIsCreatingFramework(true)
    }
  }

  const handleDeleteFramework = (frameworkId) => {
    if (frameworkId === 'default') {
      alert('Cannot delete the default framework')
      return
    }
    setFrameworks(frameworks.filter(f => f.id !== frameworkId))
    setSelectedFramework(null)
  }

  const handleCancelFramework = () => {
    setIsCreatingFramework(false)
    setSelectedFramework(null)
  }

  const getCategoryStyle = (category) => {
    const categoryData = categories[category]
    return {
      backgroundColor: categoryData.color || '#1F77B4'
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>10 Types of Innovation</h1>
        <div className="framework-controls">
          <select 
            value={selectedFramework?.id || ''}
            onChange={handleFrameworkChange}
            className="framework-select"
          >
            <option value="">10 Types of Innovation</option>
            {frameworks.filter(f => !f.isDefault).map(framework => (
              <option key={framework.id} value={framework.id}>
                {framework.name}
              </option>
            ))}
          </select>
          <button className="create-framework-btn" onClick={handleCreateFramework}>
            Create New Framework
          </button>
          <button 
            className="edit-framework-btn"
            disabled={!selectedFramework || selectedFramework.isDefault}
            onClick={handleEditFramework}
          >
            Edit Framework
          </button>
          <button 
            className="delete-framework-btn"
            disabled={!selectedFramework || selectedFramework.isDefault}
            onClick={() => handleDeleteFramework(selectedFramework.id)}
          >
            Delete Framework
          </button>
        </div>
      </div>

      {isCreatingFramework && (
        <FrameworkCreator 
          onSave={handleSaveFramework} 
          onCancel={handleCancelFramework} 
          initialData={selectedFramework} 
        />
      )}

      <div className="container">
        <div className={`main-categories ${selectedCategory ? 'horizontal' : ''}`}>
          {Object.keys(categories).map(category => (
            <button
              key={category}
              className={`category-button ${category.toLowerCase()} ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category)}
              style={getCategoryStyle(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="content-area">
            <div className={`types-panel ${selectedCategory.toLowerCase()}`}>
              <button
                className={`show-all-button ${showAll ? 'selected' : ''}`}
                onClick={handleShowAllClick}
                style={{ color: categories[selectedCategory].color }}
              >
                Show All
              </button>
              <div className="types-list">
                {categories[selectedCategory].types.map(type => (
                  <button
                    key={type.id}
                    className={`type-button ${activeTypes.has(type.id) ? 'selected' : ''}`}
                    onClick={() => handleTypeClick(type.id)}
                    style={{ color: categories[selectedCategory].color }}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="details-panel">
              {categories[selectedCategory].types
                .filter(type => activeTypes.has(type.id))
                .map(type => (
                  <div key={type.id} className="type-details">
                    <h2>{type.title}</h2>
                    <p>{type.description}</p>
                    <div className="tactics-list">
                      {type.subtypes.map((tactic, index) => (
                        <div key={index} className="tactic-card">
                          <h3>{tactic.title}</h3>
                          <p>{tactic.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
