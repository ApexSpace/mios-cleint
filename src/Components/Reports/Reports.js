import React from 'react'

const Reports = () => {
  return (
    <>
      <table className="table container table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Antony</td>
            <td>Adrian</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Meriontte</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colspan="2">Parry the Platypus</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Reports