import React, { useState, useEffect } from 'react'

const USER_STORAGE_KEY = 'user_profiles_management_data'

const INITIAL_USERS = [
  {
    id: 'user-1',
    firstName: 'Dave',
    lastName: 'Richards',
    email: 'dave@mail.com',
    contact: '+91 8332883854',
    dob: '1995-07-20',
    gender: 'Male',
    alternatePhone: '9876543210',
    address: '123 Technology Hub, Silicon Valley',
    pincode: '94025',
    domicileState: 'California',
    education: [
      { id: 1, school: 'Lincoln College', degree: 'Bachelors in Technology', course: 'Computer Science Engineering', year: '2017', grade: '8.5/10' },
      { id: 2, school: 'Local High School', degree: 'High School Diploma', course: 'Science', year: '2013', grade: '90%' }
    ],
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'Node.js', 'PostgreSQL'],
    projects: [
      { id: 1, name: 'Portfolio Website', description: 'Built a personal portfolio using React and Gatsby.' },
      { id: 2, name: 'E-commerce Backend', description: 'Developed a scalable REST API using Node.js and Express.' }
    ],
    experience: [
      { id: 1, domain: 'Technology', subDomain: 'Frontend Development', description: 'Lead developer for major client projects.', years: 3 },
      { id: 2, domain: 'Internship', subDomain: 'Software Engineering', description: 'Contributed to the core infrastructure team.', years: 1 }
    ]
  },
  {
    id: 'user-2',
    firstName: 'Abhishek',
    lastName: 'Hari',
    email: 'hari@mail.com',
    contact: '+91 9876543210',
    dob: '1998-01-15',
    gender: 'Male',
    alternatePhone: '9988776655',
    address: '456 Business Park, Mumbai',
    pincode: '400001',
    domicileState: 'Maharashtra',
    education: [],
    skills: ['Python', 'Django', 'SQL'],
    projects: [],
    experience: [{ id: 1, domain: 'Data Science', subDomain: 'ML Engineer', description: 'Built predictive models for finance.', years: 2 }]
  },
  {
    id: 'user-3',
    firstName: 'Nishita',
    lastName: 'Gupta',
    email: 'nishta@mail.com',
    contact: '+91 7766554433',
    dob: '1997-03-22',
    gender: 'Female',
    alternatePhone: '1122334455',
    address: '789 Startup Alley, Bangalore',
    pincode: '560001',
    domicileState: 'Karnataka',
    education: [],
    skills: ['Product Management', 'Market Research'],
    projects: [],
    experience: []
  }
]

const loadUsers = () => {
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading users from storage', err)
  }
  return INITIAL_USERS
}

const saveUsers = (list) => {
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Error saving users to storage', err)
  }
}

const IconEdit = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
)

const IconTrash = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
)

const IconUser = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

const IconPlus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

const ConfirmationModal = ({ open, onClose, onConfirm, targetUser }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <IconTrash className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
          </div>
          <p className="text-gray-600 mb-6">Are you sure you want to delete the profile for <strong>{targetUser?.firstName} {targetUser?.lastName}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition">Delete Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddUserDialog = ({ open, onClose, onCreate }) => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!open) {
      setDisplayName('')
      setEmail('')
      setContact('')
      setValidationError('')
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!displayName || !email) {
      setValidationError('Name and Email are required.')
      return
    }
    const newUser = {
      id: 'user-' + Date.now(),
      firstName: displayName.split(' ')[0] || displayName,
      lastName: displayName.split(' ').slice(1).join(' ') || '',
      email,
      contact,
      dob: '',
      gender: '',
      alternatePhone: '',
      address: '',
      pincode: '',
      domicileState: '',
      education: [],
      skills: [],
      projects: [],
      experience: []
    }
    onCreate(newUser)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><IconPlus className="rotate-45" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationError && <div className="p-2 text-sm text-red-700 bg-red-100 rounded-lg">{validationError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name of the user</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. John Doe" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. user@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. +91 9988776655" />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition">Add User</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const BasicInfoSection = ({ profile, onSaveProfile, editing, setEditing }) => {
  const [local, setLocal] = useState(profile || {})

  useEffect(() => {
    setLocal(profile || {})
  }, [profile])

  const handleChange = (e) => setLocal({ ...local, [e.target.name]: e.target.value })

  const handleSave = () => {
    onSaveProfile(local)
    setEditing(false)
  }

  const inputBase = `w-full p-2 border ${editing ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'border-transparent text-gray-600 bg-gray-50'} rounded-lg transition`
  const labelBase = 'block text-sm font-medium text-gray-700 mb-1'

  const fields = [
    { name: 'firstName', label: 'First name', placeholder: 'e.g. John' },
    { name: 'lastName', label: 'Last name', placeholder: 'e.g. Doe' },
    { name: 'email', label: 'Email ID', placeholder: 'e.g. user@mail.com', type: 'email', disabled: true },
    { name: 'dob', label: 'Year of birth', placeholder: 'YYYY-MM-DD', type: 'date' },
    { name: 'gender', label: 'Gender', placeholder: 'Select an option', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'contact', label: 'Phone number', placeholder: 'e.g. +91 9988776655', type: 'tel' },
    { name: 'alternatePhone', label: 'Alternate Phone no', placeholder: 'e.g. 9876543210', type: 'tel' },
    { name: 'address', label: 'Address', placeholder: 'Enter here', span: 'col-span-2' },
    { name: 'pincode', label: 'Pincode', placeholder: 'Enter here' },
    { name: 'domicileState', label: 'Domicile state', placeholder: 'Select an option', type: 'text' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Basic Details</h3>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="flex items-center space-x-1 p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
          <IconEdit className="w-4 h-4" />
          <span className="text-sm font-medium">{editing ? 'Save Details' : 'Edit Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.span || 'col-span-1'}>
            <label className={labelBase}>{field.label}</label>
            {field.type === 'select' ? (
              <select name={field.name} value={local[field.name] || ''} onChange={handleChange} className={inputBase} disabled={!editing}>
                <option value="">{field.placeholder}</option>
                {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input type={field.type || 'text'} name={field.name} value={local[field.name] || ''} onChange={handleChange} className={inputBase} placeholder={field.placeholder} disabled={!editing || field.disabled} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const EducationSkillsSection = ({ profile, onSaveProfile, editing, setEditing }) => {
  const [local, setLocal] = useState(profile || {})
  const [newEducation, setNewEducation] = useState({})
  const [newProject, setNewProject] = useState({})

  useEffect(() => setLocal(profile || {}), [profile])

  const handleSave = () => {
    onSaveProfile(local)
    setEditing(false)
  }

  const handleEducationChange = (id, field, value) => {
    const updated = local.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    setLocal({ ...local, education: updated })
  }

  const addEducation = () => {
    if (newEducation.school && newEducation.degree) {
      const id = (local.education?.length || 0) + 1
      setLocal({ ...local, education: [...(local.education || []), { id, ...newEducation }] })
      setNewEducation({})
    }
  }

  const deleteEducation = (id) => setLocal({ ...local, education: (local.education || []).filter((e) => e.id !== id) })

  const handleSkillsChange = (e) => setLocal({ ...local, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })

  const addProject = () => {
    if (newProject.name && newProject.description) {
      const id = (local.projects?.length || 0) + 1
      setLocal({ ...local, projects: [...(local.projects || []), { id, ...newProject }] })
      setNewProject({})
    }
  }

  const deleteProject = (id) => setLocal({ ...local, projects: (local.projects || []).filter((p) => p.id !== id) })

  const inputBase = `w-full p-2 border ${editing ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'border-transparent text-gray-600 bg-gray-50'} rounded-lg transition`
  const labelBase = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Education Details</h3>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="flex items-center space-x-1 p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
          <IconEdit className="w-4 h-4" />
          <span className="text-sm font-medium">{editing ? 'Save Details' : 'Edit Details'}</span>
        </button>
      </div>

      {(local.education || []).map((edu) => (
        <div key={edu.id} className="p-4 border border-gray-100 rounded-xl space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className={labelBase}>School / College</label>
              <input type="text" value={edu.school || ''} onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)} className={inputBase} placeholder="e.g. Lincoln College" disabled={!editing} />
            </div>
            <div className="col-span-2">
              <label className={labelBase}>Highest degree or equivalent</label>
              <input type="text" value={edu.degree || ''} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} className={inputBase} placeholder="e.g. Bachelors in Technology" disabled={!editing} />
            </div>
            <div className="col-span-1">
              <label className={labelBase}>Course</label>
              <input type="text" value={edu.course || ''} onChange={(e) => handleEducationChange(edu.id, 'course', e.target.value)} className={inputBase} placeholder="e.g. Computer science engineering" disabled={!editing} />
            </div>
            <div className="col-span-1">
              <label className={labelBase}>Year of completion</label>
              <input type="text" value={edu.year || ''} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} className={inputBase} placeholder="YYYY" disabled={!editing} />
            </div>
            <div className="col-span-2">
              <label className={labelBase}>Grade</label>
              <input type="text" value={edu.grade || ''} onChange={(e) => handleEducationChange(edu.id, 'grade', e.target.value)} className={inputBase} placeholder="Enter here" disabled={!editing} />
            </div>
          </div>
          {editing && <button onClick={() => deleteEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"><IconTrash className="w-4 h-4" /></button>}
        </div>
      ))}

      {editing && (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl space-y-4">
          <h4 className="font-semibold text-blue-800">Add New Education</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="School/College" value={newEducation.school || ''} onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })} className="col-span-2 p-2 border border-blue-300 rounded-lg" />
            <input type="text" placeholder="Degree" value={newEducation.degree || ''} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} className="col-span-2 p-2 border border-blue-300 rounded-lg" />
            <input type="text" placeholder="Course" value={newEducation.course || ''} onChange={(e) => setNewEducation({ ...newEducation, course: e.target.value })} className="col-span-1 p-2 border border-blue-300 rounded-lg" />
            <input type="text" placeholder="Year" value={newEducation.year || ''} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} className="col-span-1 p-2 border border-blue-300 rounded-lg" />
            <input type="text" placeholder="Grade" value={newEducation.grade || ''} onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })} className="col-span-2 p-2 border border-blue-300 rounded-lg" />
          </div>
          <div className="flex justify-end">
            <button onClick={addEducation} className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Add Entry</button>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Skills & Projects</h3>
          {editing && <div />}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma Separated)</label>
          <input type="text" value={(local.skills || []).join(', ')} onChange={handleSkillsChange} className={inputBase} placeholder="e.g. React, JavaScript, Node.js" disabled={!editing} />
          <div className="mt-2 flex flex-wrap gap-2">
            {(local.skills || []).map((skill, i) => <span key={i} className="px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">{skill}</span>)}
          </div>
        </div>

        <h4 className="font-semibold text-gray-800 mb-2">Projects {(local.projects || []).length}</h4>
        <div className="space-y-3">
          {(local.projects || []).map((project) => (
            <div key={project.id} className="p-3 border border-gray-100 rounded-lg relative">
              <p className="font-medium text-gray-700">{project.name}</p>
              <p className="text-sm text-gray-500">{project.description}</p>
              {editing && <button onClick={() => deleteProject(project.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"><IconTrash className="w-4 h-4" /></button>}
            </div>
          ))}
          {editing && (
            <div className="p-3 border border-blue-200 bg-blue-50 rounded-xl space-y-2">
              <input type="text" placeholder="Project Name" value={newProject.name || ''} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="w-full p-2 border border-blue-300 rounded-lg" />
              <textarea placeholder="Description" value={newProject.description || ''} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full p-2 border border-blue-300 rounded-lg"></textarea>
              <div className="flex justify-end">
                <button onClick={addProject} className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Add Project</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ExperienceSection = ({ profile, onSaveProfile, editing, setEditing }) => {
  const [local, setLocal] = useState(profile || {})
  const [newEntry, setNewEntry] = useState({})

  useEffect(() => setLocal(profile || {}), [profile])

  const handleSave = () => {
    onSaveProfile(local)
    setEditing(false)
  }

  const handleExperienceChange = (id, field, value) => {
    const updated = (local.experience || []).map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    setLocal({ ...local, experience: updated })
  }

  const addExperience = () => {
    if (newEntry.domain && newEntry.years) {
      const id = (local.experience?.length || 0) + 1
      setLocal({ ...local, experience: [...(local.experience || []), { id, ...newEntry }] })
      setNewEntry({})
    }
  }

  const deleteExperience = (id) => setLocal({ ...local, experience: (local.experience || []).filter((e) => e.id !== id) })

  const inputBase = `w-full p-2 border ${editing ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'border-transparent text-gray-600 bg-gray-50'} rounded-lg transition`
  const labelBase = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="flex items-center space-x-1 p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
          <IconEdit className="w-4 h-4" />
          <span className="text-sm font-medium">{editing ? 'Save Details' : 'Edit Details'}</span>
        </button>
      </div>

      {(local.experience || []).map((exp) => (
        <div key={exp.id} className="p-4 border border-gray-100 rounded-xl space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>Domain</label>
              <input type="text" value={exp.domain || ''} onChange={(e) => handleExperienceChange(exp.id, 'domain', e.target.value)} className={inputBase} placeholder="e.g. Technology" disabled={!editing} />
            </div>
            <div>
              <label className={labelBase}>Sub-domain</label>
              <input type="text" value={exp.subDomain || ''} onChange={(e) => handleExperienceChange(exp.id, 'subDomain', e.target.value)} className={inputBase} placeholder="e.g. MERN Stack" disabled={!editing} />
            </div>
            <div>
              <label className={labelBase}>Years of Experience</label>
              <input type="number" value={exp.years || ''} onChange={(e) => handleExperienceChange(exp.id, 'years', parseInt(e.target.value, 10) || 0)} className={inputBase} placeholder="Enter years" disabled={!editing} />
            </div>
            <div className="col-span-3">
              <label className={labelBase}>Description / Role</label>
              <textarea value={exp.description || ''} onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)} className={inputBase} placeholder="Describe your responsibilities" disabled={!editing} />
            </div>
          </div>
          {editing && <button onClick={() => deleteExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"><IconTrash className="w-4 h-4" /></button>}
        </div>
      ))}

      {editing && (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl space-y-4">
          <h4 className="font-semibold text-blue-800">Add New Work Experience</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Domain" value={newEntry.domain || ''} onChange={(e) => setNewEntry({ ...newEntry, domain: e.target.value })} className="p-2 border border-blue-300 rounded-lg" />
            <input type="text" placeholder="Sub-domain" value={newEntry.subDomain || ''} onChange={(e) => setNewEntry({ ...newEntry, subDomain: e.target.value })} className="p-2 border border-blue-300 rounded-lg" />
            <input type="number" placeholder="Years" value={newEntry.years || ''} onChange={(e) => setNewEntry({ ...newEntry, years: parseInt(e.target.value, 10) || 0 })} className="p-2 border border-blue-300 rounded-lg" />
            <textarea placeholder="Description" value={newEntry.description || ''} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} className="col-span-3 p-2 border border-blue-300 rounded-lg"></textarea>
          </div>
          <div className="flex justify-end">
            <button onClick={addExperience} className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Add Entry</button>
          </div>
        </div>
      )}

      {!(profile.experience || []).length && !editing && <p className="text-gray-500 italic text-center py-4">No work experience added yet.</p>}
    </div>
  )
}

const ProfileEditor = ({ profile, onSave, onReturn }) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [editing, setEditing] = useState(false)

  const sections = [
    { id: 'basic', label: 'Basic Info', component: BasicInfoSection },
    { id: 'education', label: 'Education & Skills', component: EducationSkillsSection },
    { id: 'experience', label: 'Experience', component: ExperienceSection }
  ]

  const ActiveSection = sections.find((s) => s.id === activeTab).component

  const handleSaveProfile = (payload) => onSave(payload)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={onReturn} className="flex items-center text-blue-600 hover:text-blue-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="font-medium ml-1">Back to Users</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 border-4 border-blue-300">
            <IconUser className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{profile.firstName} {profile.lastName}</h1>
            <p className="text-lg text-gray-600 mt-1">{profile.email}</p>
            <p className="text-md text-gray-500 mt-0.5">{profile.contact}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100">
        <div className="flex flex-wrap border-b border-gray-200">
          {sections.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditing(false) }} className={`px-6 py-3 text-lg font-medium transition duration-300 ${activeTab === tab.id ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pt-8">
          <ActiveSection profile={profile} onSaveProfile={handleSaveProfile} editing={editing} setEditing={setEditing} />
        </div>
      </div>
    </div>
  )
}

const UsersListView = ({ users, onOpenProfile, onOpenCreateDialog, onRequestDelete }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Profiles Management</h1>
        <button onClick={onOpenCreateDialog} className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
          <IconPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium" onClick={() => onOpenProfile(user.id)}>{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => onOpenProfile(user.id)} title="View/Edit Profile" className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition">
                      <IconEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onRequestDelete(user)} title="Delete User" className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-500/10 transition">
                      <IconTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <div className="p-6 text-center text-gray-500 italic">No users found. Click "Add User" to get started.</div>}
      </div>
    </div>
  )
}

const App = () => {
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [view, setView] = useState('list')
  const [activeUserId, setActiveUserId] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null)

  useEffect(() => {
    setLoading(true)
    setLoadError(null)
    setTimeout(() => {
      try {
        const stored = loadUsers()
        setUserList(stored)
        setLoading(false)
      } catch (err) {
        console.error('Initialization error', err)
        setLoadError('Failed to load user data from storage.')
        setLoading(false)
      }
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) saveUsers(userList)
  }, [userList, loading])

  const openCreateDialog = () => setCreateDialogOpen(true)

  const createUser = (newUser) => {
    setUserList((prev) => [...prev, newUser])
    setActiveUserId(newUser.id)
    setView('details')
  }

  const requestDeleteUser = (user) => setPendingDeleteUser(user)

  const confirmDeleteUser = () => {
    if (!pendingDeleteUser) return
    const id = pendingDeleteUser.id
    setUserList((prev) => prev.filter((u) => u.id !== id))
    if (activeUserId === id) {
      setView('list')
      setActiveUserId(null)
    }
    setPendingDeleteUser(null)
  }

  const cancelDelete = () => setPendingDeleteUser(null)

  const saveUser = (updated) => setUserList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))

  const openProfile = (id) => {
    setActiveUserId(id)
    setView('details')
  }

  const closeProfile = () => {
    setView('list')
    setActiveUserId(null)
  }

  const selectedUser = userList.find((u) => u.id === activeUserId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-xl shadow-lg flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-700 font-medium">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-6 bg-white rounded-xl shadow-lg border border-red-300">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{loadError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Reload Application</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-blue-600">PROFILE ADMIN</div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm hidden sm:inline">User: {userList.length} Total</span>
            <IconUser className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </header>

      <main>
        {view === 'list' && <UsersListView users={userList} onOpenProfile={openProfile} onOpenCreateDialog={openCreateDialog} onRequestDelete={requestDeleteUser} />}
        {view === 'details' && selectedUser && <ProfileEditor profile={selectedUser} onSave={saveUser} onReturn={closeProfile} />}
      </main>

      <AddUserDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreate={createUser} />

      <ConfirmationModal open={!!pendingDeleteUser} onClose={cancelDelete} onConfirm={confirmDeleteUser} targetUser={pendingDeleteUser || { firstName: '', lastName: '' }} />
    </div>
  )
}

export default App
