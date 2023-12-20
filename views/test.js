/* <% if (typeof(job) !== 'undefined') { %>
    <dialog class="modal-seemore">
      <div class="modal-content">
        <div class="modal-header">
          <h2><%= job.jobtitle %></h2>
          <button class="close">X</button>
        </div>
        <div class="modal-body">
          <p><%= job.company_name %></p>
          
          <p>Website</p>
          <p><%= job.address %></p>
          <p><%= job.phone %></p>
          <p><%= job.email %></p>
          <p><%= job.origin %></p>
          <p><%= job.status %></p>
          <p><%= job.comments %></p>
        </div>
        <div class="modal-footer">
          <button class="close">Close</button>
        </div>
      </div>    
    </dialog>
  <% } %> */