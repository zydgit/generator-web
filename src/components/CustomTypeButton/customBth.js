// const CustomBtnName = [
//   {
//     text: '主按钮',
//     class: 'xy-primary',
//     type: 'xy-primary',
//     icon: ''
//   },
//   {
//     text: '取消按钮',
//     class: 'xy-cancel',
//     type: 'xy-cancel',
//     icon: ''
//   },
//   {
//     text: 'table编辑',
//     class: 'xy-table-edit',
//     type: 'xy-table-edit',
//     icon: 'el-icon-edit'
//   }
// ]
//
// export default {
//   inserted(el, name, vm) {
//     let icon = ''
//     let vClass = ''
//     const type = typeof vm.context.type
//
//     CustomBtnName.forEach(item => {
//       if (type.indexOf(item.type) !== -1) {
//         vClass = item.class
//         icon = item.icon
//       }
//     })
//
//     const className = el.getAttribute('class').split(' ')
//     className.push(vClass)
//     el.setAttribute('class', className.join(' '))
//
//     vm.create
//   }
// }
