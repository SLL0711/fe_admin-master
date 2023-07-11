import store from '@/store'

// 自定义v-permission指令 用于组件显示/隐藏权限控制
function checkPermission(el, binding) {
  const { value } = binding
  const permissions = store.getters && store.getters.permissions

  // e.c. value = ['admin','cmdb-servers-add'] 当前按钮需要权限：admin|cmdb-servers-add
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = permissions.some(permission => {
        return permissionRoles.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
