import axios from 'axios'


export const updateEmail = async (email) => {
  await axios.put(`http://localhost:3000/emails/${email.id}`, email)
}

export const fetchEmails = async () => {
  const response = await axios.get('http://localhost:3000/emails');
  const emails = response.data
  return emails;
}

export const toggleEmailProperty = async ({ emails, email, property }) => {
  email[property] = !email[property]
  emails.value = await fetchEmails();
  await updateEmail(email);
}