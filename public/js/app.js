const options = {
    valueNames: ['name', 'tasks']
};
const userList = new List('users', options);

//  * FUNCTIONS

const anc = document.querySelectorAll('h3').forEach(e => {
    e.addEventListener('click', async () => {
        const req = await fetch(`/${e.innerText}`, {
            method: 'Post'
        });
        if (req.status = 200) {
            location.href = req.url
        }
    });
});

const delet = (e) => {
    e.target.parentNode.remove();

}


//  * EVENT LISTENERS

const del = document.querySelectorAll('.cross').forEach((e) => {
    e.addEventListener('click', (e) => {
        const ans = confirm('Are you sure you want to delete?')
        if (!ans) return
        const delt = e.target.parentNode.getAttribute('data-id');
        delet(e)
        if (delt && delt != '') {
            (async function delreq() {
                const req = await fetch(`/del?title=${delt}`, {"method" : 'POST'});
                const res = req.status
                if (res === 200) {
                    return
                } else {
                    console.error('something went wrong cannot delete');
                }
            })();
        }
    });
});

document.querySelector('.csr').addEventListener('click', (e) => {
    document.getElementById('addnew').style.display = 'flex';
});

document.getElementById('af').addEventListener('submit', (e) => {
    e.preventDefault()
    const inp = document.getElementById('new').value;
    if (inp && inp !== '') {
        (async function add() {
            const req = await fetch(`/add?title=${inp}`, {
                "method": 'POST',
            });
            const res = req.status
            if (res === 200) {
                location.reload()
            } else {
                return
            }
        })();
    }
});

document.getElementById('addnew').addEventListener('click', (e) => {
    if (e.target.id !== 'addb' && e.target.id !== 'new') {
        document.getElementById('addnew').style.display = 'none';
    }
});