const auth = firebase.auth()

const whenSignedIn = document.getElementById('whenSignedIn')
const whenSignedOut = document.getElementById('whenSignedOut')

const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')

const userDetails = document.getElementById('userDetails')
const userImage = document.getElementById('userImage')


const provider = new firebase.auth.GoogleAuthProvider()

signInBtn.onclick = () => auth.signInWithPopup(provider)

signOutBtn.onclick = () => auth.signOut()


auth.onAuthStateChanged(user => {

    if (user) {
        // Signed in

        whenSignedOut.hidden = true
        whenSignedIn.hidden = false
        userImage.innerHTML = `<img id="image" src="${user.photoURL}" alt="image"/>`
        userDetails.innerHTML = `<h3>${user.displayName}</h3>`

    } else {
        // Not signed in

        whenSignedOut.hidden = false
        whenSignedIn.hidden = true
        userDetails.innerHTML = ''

    }
})