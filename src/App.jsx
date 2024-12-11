import React, { useState, useEffect } from 'react'
import { innovationTypes } from './innovationData'
import './App.css'
import FrameworkCreator from './components/FrameworkCreator'

function App() {
  // ... (previous state declarations remain the same)

  const handleEditFramework = (framework) => {
    // Convert the framework categories object back to array format for the editor
    const categoriesArray = Object.entries(framework.categories).map(([name, types]) => ({
      name,
      color: getColorForCategory(name), // We'll define this helper function
      types: types.map(type => ({
        ...type,
        subtypes: type.subtypes || []
      }))
    }))

    const frameworkForEdit = {
      ...framework,
      categories: categoriesArray
    }
    
    setSelectedFramework(frameworkForEdit)
    setIsCreatingFramework(true)
  }

  // Helper function to get default colors for categories
  const getColorForCategory = (categoryName) => {
    const colorMap = {
      'Configuration': '#1F77B4',
      'Offering': '#FF7F0E',
      'Experience': '#2CA02C'
    }
    return colorMap[categoryName] || '#1F77B4' // Default color if not found
  }

  const handleSaveFramework = (framework) => {
    // Convert the categories array back to the required object format
    const formattedCategories = {}
    framework.categories.forEach(category => {
      formattedCategories[category.name] = category.types
    })

    const updatedFramework = {
      ...framework,
      categories: formattedCategories
    }

    if (framework.id) {
      // Edit existing framework
      setFrameworks(frameworks.map(f => 
        f.id === framework.id ? updatedFramework : f
      ))
      setSelectedFramework(updatedFramework)
    } else {
      // Create new framework
      const newFramework = {
        ...updatedFramework,
        id: Date.now().toString()
      }
      setFrameworks([...frameworks, newFramework])
      setSelectedFramework(newFramework)
    }
    setIsCreatingFramework(false)
  }

  // ... (rest of the component remains the same)

  return (
    <div className="app">
      <div className="header">
        <h1>10 Types of Innovation</h1>
        <div className="framework-controls">
          <select 
            value={selectedFramework?.id || ''}
            onChange={(e) => {
              const selected = frameworks.find(f => f.id === e.target.value)
              setSelectedFramework(selected || null)
            }}
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
            onClick={() => handleEditFramework(selectedFramework)}
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

      {/* ... (rest of the JSX remains the same) */}
    </div>
  )
}

export default App
