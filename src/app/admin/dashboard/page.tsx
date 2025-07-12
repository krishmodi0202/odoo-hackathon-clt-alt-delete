"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  UsersIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  UserMinusIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

type User = {
  id: string
  email: string
  full_name: string
  points: number
  created_at: string
  avatar_url?: string
}

type Item = {
  id: string
  title: string
  status: string
  user_id: string
  created_at: string
  points_value: number
  category: string
  type: string
  profiles: {
    full_name: string
    email: string
  }
}

type Swap = {
  id: string
  status: string
  created_at: string
  requester_id: string
  item_id: string
  items: {
    id: string
    title: string
    points_value: number
    user_id: string
  }
  profiles: {
    full_name: string
    email: string
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalSwaps: 0,
    pendingSwaps: 0,
    totalPoints: 0,
    activeUsers: 0,
    completedSwaps: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [swaps, setSwaps] = useState<Swap[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [pointsAdjustment, setPointsAdjustment] = useState(0)
  const [showPointsModal, setShowPointsModal] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    const adminAuth = localStorage.getItem("adminAuthenticated")
    const loginTime = localStorage.getItem("adminLoginTime")

    if (!adminAuth || !loginTime) {
      router.push("/admin/login")
      return
    }

    const now = Date.now()
    const loginTimestamp = Number.parseInt(loginTime)
    if (now - loginTimestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("adminAuthenticated")
      localStorage.removeItem("adminLoginTime")
      router.push("/admin/login")
      return
    }

    setIsAuthenticated(true)
    setLoading(false)
    fetchAdminData()
  }

  const fetchAdminData = async () => {
    try {
      const { data: usersData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      const { data: itemsData } = await supabase
        .from("items")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      const { data: swapsData } = await supabase
        .from("swaps")
        .select(`
          *,
          items (
            id,
            title,
            points_value,
            user_id
          ),
          profiles!swaps_requester_id_fkey (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      setUsers(usersData || [])
      setItems(itemsData || [])
      setSwaps(swapsData || [])

      const totalUsers = usersData?.length || 0
      const totalItems = itemsData?.length || 0
      const totalSwaps = swapsData?.length || 0
      const pendingSwaps = swapsData?.filter((s) => s.status === "pending").length || 0
      const completedSwaps = swapsData?.filter((s) => s.status === "completed").length || 0
      const totalPoints = usersData?.reduce((sum, user) => sum + (user.points || 0), 0) || 0
      const activeUsers = usersData?.filter((u) => u.points > 0).length || 0

      setStats({
        totalUsers,
        totalItems,
        totalSwaps,
        pendingSwaps,
        totalPoints,
        activeUsers,
        completedSwaps,
      })
    } catch (error) {
      console.error("Error fetching admin data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminLoginTime")
    router.push("/admin/login")
  }

  const handleSwapAction = async (swapId: string, action: "approve" | "reject") => {
    try {
      const newStatus = action === "approve" ? "accepted" : "rejected"

      const { error } = await supabase.from("swaps").update({ status: newStatus }).eq("id", swapId)

      if (error) throw error

      await fetchAdminData()
      alert(`Swap ${action}ed successfully!`)
    } catch (error) {
      console.error(`Error ${action}ing swap:`, error)
      alert(`Failed to ${action} swap. Please try again.`)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const { error } = await supabase.from("items").delete().eq("id", itemId)

      if (error) throw error

      await fetchAdminData()
      alert("Item deleted successfully!")
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will also delete all their items and swaps. This action cannot be undone.",
      )
    )
      return

    try {
      // Delete swaps first
      const { error: swapsError } = await supabase.from("swaps").delete().eq("requester_id", userId)

      if (swapsError) throw swapsError

      // Delete items
      const { error: itemsError } = await supabase.from("items").delete().eq("user_id", userId)

      if (itemsError) throw itemsError

      // Delete user profile
      const { error: userError } = await supabase.from("profiles").delete().eq("id", userId)

      if (userError) throw userError

      await fetchAdminData()
      alert("User and all associated data deleted successfully!")
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    }
  }

  const handleAdjustPoints = async () => {
    if (!selectedUser || pointsAdjustment === 0) return

    try {
      const newPoints = Math.max(0, selectedUser.points + pointsAdjustment)

      const { error } = await supabase.from("profiles").update({ points: newPoints }).eq("id", selectedUser.id)

      if (error) throw error

      await fetchAdminData()
      setShowPointsModal(false)
      setSelectedUser(null)
      setPointsAdjustment(0)
      alert(`Points adjusted successfully! New balance: ${newPoints}`)
    } catch (error) {
      console.error("Error adjusting points:", error)
      alert("Failed to adjust points. Please try again.")
    }
  }

  const openPointsModal = (user: User) => {
    setSelectedUser(user)
    setPointsAdjustment(0)
    setShowPointsModal(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredSwaps = swaps.filter((swap) => {
    const matchesSearch =
      swap.items?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || swap.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                  <CogIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                <p className="text-xs text-blue-700">{stats.activeUsers} active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-green-600">Total Items</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalItems}</p>
                <p className="text-xs text-green-700">
                  {items.filter((i) => i.status === "available").length} available
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-purple-600">Total Swaps</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalSwaps}</p>
                <p className="text-xs text-purple-700">{stats.completedSwaps} completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-amber-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-amber-600">Total Points</p>
                <p className="text-2xl font-bold text-amber-900">{stats.totalPoints}</p>
                <p className="text-xs text-amber-700">Across all users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, items, or swaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="swapped">Swapped</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: ChartBarIcon },
                { id: "users", name: "Users", icon: UsersIcon },
                { id: "items", name: "Items", icon: HeartIcon },
                { id: "swaps", name: "Swaps", icon: ChatBubbleLeftRightIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.full_name || "Anonymous"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.points} pts</p>
                        <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Items */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Items</h3>
                <div className="space-y-3">
                  {items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">by {item.profiles?.full_name || "Anonymous"}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "available"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Points Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Points Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.points >= 100).length}</div>
                  <div className="text-sm text-green-700">High Points (100+)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {users.filter((u) => u.points >= 10 && u.points < 100).length}
                  </div>
                  <div className="text-sm text-yellow-700">Medium Points (10-99)</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.points < 10).length}</div>
                  <div className="text-sm text-red-700">Low Points ({"<"}10)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">All Users ({filteredUsers.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.full_name || "Anonymous"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.points || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openPointsModal(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Adjust Points"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <UserMinusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "items" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">All Items ({filteredItems.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.profiles?.full_name || "Anonymous"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.points_value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "available"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link
                            href={`/items/${item.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Item"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Item"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "swaps" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">All Swaps ({filteredSwaps.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSwaps.map((swap) => (
                    <tr key={swap.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{swap.items?.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{swap.profiles?.full_name || "Anonymous"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {users.find((u) => u.id === swap.items?.user_id)?.full_name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{swap.items?.points_value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            swap.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : swap.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : swap.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {swap.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(swap.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {swap.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSwapAction(swap.id, "approve")}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Swap"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSwapAction(swap.id, "reject")}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Swap"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Points Adjustment Modal */}
      {showPointsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Adjust Points</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                User: <strong>{selectedUser.full_name || "Anonymous"}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Current Points: <strong>{selectedUser.points}</strong>
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Points Adjustment</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPointsAdjustment((prev) => prev - 10)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(Number.parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0"
                />
                <button
                  onClick={() => setPointsAdjustment((prev) => prev + 10)}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Use positive numbers to add points, negative to subtract</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPointsModal(false)
                  setSelectedUser(null)
                  setPointsAdjustment(0)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustPoints}
                disabled={pointsAdjustment === 0}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
