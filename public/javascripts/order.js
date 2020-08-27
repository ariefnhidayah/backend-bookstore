function submitAction(e) {
    const form = $(e).parent()[0]
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.value) {
            $(form).submit()
        }
    })
}