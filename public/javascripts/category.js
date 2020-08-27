const showModal = (e) => {
    $('#editModal').modal('show')
    const categoryName = $(e).data('name')
    const id = $(e).data('id')
    $('#editModal #editName').val(categoryName)
    $('#editModal #id').val(id)
}