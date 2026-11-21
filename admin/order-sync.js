(function () {
  var OrderSyncControl = createClass({
    getInitialState: function () {
      return {
        syncing: false,
        message: "",
        draggedTitle: null,
        dragStartOrder: [],
        previewItems: null,
        dropTarget: null,
        dropAfter: false,
      };
    },

    getItems: function () {
      var value = this.props.value;
      if (value && typeof value.toJS === "function") value = value.toJS();
      return Array.isArray(value) ? value : [];
    },

    syncFromPublishedPage: function () {
      var self = this;
      var sourcePath = this.props.field.get("source_path");
      this.setState({ syncing: true, message: "Lettura dei contenuti pubblicati…" });

      fetch(sourcePath, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("La pagina non è raggiungibile (HTTP " + response.status + ").");
          return response.text();
        })
        .then(function (html) {
          var page = new DOMParser().parseFromString(html, "text/html");
          var published = Array.from(page.querySelectorAll("article.article-card h2 a"))
            .map(function (link) { return link.textContent.trim(); })
            .filter(Boolean);
          var uniquePublished = Array.from(new Set(published));
          var current = self.getItems();
          var publishedSet = new Set(uniquePublished);
          var currentSet = new Set(current);
          var retained = current.filter(function (title) { return publishedSet.has(title); });
          var added = uniquePublished.filter(function (title) { return !currentSet.has(title); });
          var removed = current.filter(function (title) { return !publishedSet.has(title); }).length;

          // Insert new content in the displayed order, retain manual order for existing
          // items, and remove entries that no longer appear on the published page.
          self.props.onChange(added.concat(retained));
          self.setState({
            syncing: false,
            message: added.length || removed
              ? added.length + " aggiunti in cima, " + removed + " rimossi. Premi Salva per applicare."
              : "Lista già aggiornata. Premi Salva per applicare eventuali modifiche.",
          });
        })
        .catch(function (error) {
          self.setState({ syncing: false, message: "Sincronizzazione non riuscita: " + error.message });
        });
    },

    handleDragStart: function (event, title) {
      var items = this.getItems().slice();
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", title);
      this.setState({
        draggedTitle: title,
        dragStartOrder: items,
        previewItems: items,
        dropTarget: null,
        dropAfter: false,
      });
    },

    handleDragOver: function (event, targetTitle) {
      event.preventDefault();
      var draggedTitle = this.state.draggedTitle;
      if (!draggedTitle || draggedTitle === targetTitle) return;

      var targetElement = event.currentTarget;
      var rect = targetElement.getBoundingClientRect();
      var dropAfter = event.clientY > rect.top + rect.height / 2;
      var preview = this.state.previewItems || this.state.dragStartOrder;
      var sourceIndex = preview.indexOf(draggedTitle);
      var targetIndex = preview.indexOf(targetTitle);
      if (sourceIndex < 0 || targetIndex < 0) return;

      var insertionIndex = targetIndex + (dropAfter ? 1 : 0);
      var next = preview.slice();
      var moved = next.splice(sourceIndex, 1)[0];
      if (sourceIndex < insertionIndex) insertionIndex -= 1;
      next.splice(insertionIndex, 0, moved);

      var orderChanged = preview.some(function (title, index) { return title !== next[index]; });
      var markerChanged = this.state.dropTarget !== targetTitle || this.state.dropAfter !== dropAfter;
      if (orderChanged || markerChanged) {
        this.setState({
          previewItems: next,
          dropTarget: targetTitle,
          dropAfter: dropAfter,
        });
      }
    },

    finishDrag: function () {
      var preview = this.state.previewItems;
      var current = this.getItems();
      var changed = preview && (current.length !== preview.length || current.some(function (title, index) {
        return title !== preview[index];
      }));
      if (changed) this.props.onChange(preview);
      this.setState({
        draggedTitle: null,
        dragStartOrder: [],
        previewItems: null,
        dropTarget: null,
        dropAfter: false,
      });
    },

    render: function () {
      var self = this;
      var items = this.state.previewItems || this.getItems();
      return h("div", { className: this.props.classNameWrapper },
        h("button", {
          type: "button",
          disabled: this.state.syncing,
          onClick: this.syncFromPublishedPage,
          style: {
            marginBottom: "10px",
            padding: "8px 14px",
            color: "#fff",
            background: "#2868c7",
            border: "1px solid #2868c7",
            borderRadius: "4px",
            fontWeight: "600",
            cursor: this.state.syncing ? "wait" : "pointer",
          },
        }, this.state.syncing ? "Sincronizzazione…" : "Sincronizza con la pagina"),
        h("p", {
          role: "status",
          "aria-live": "polite",
          style: { minHeight: "20px", margin: "0 0 10px", color: "#52606d" },
        }, this.state.message),
        h("ol", {
          style: {
            maxHeight: "55vh",
            overflowY: "auto",
            padding: "2px 8px 2px 38px",
            margin: 0,
          },
        }, items.map(function (title, index) {
          var isDragging = self.state.draggedTitle === title;
          var isTarget = self.state.dropTarget === title;
          var style = {
            cursor: isDragging ? "grabbing" : "grab",
            padding: "10px 12px",
            margin: "0 0 5px",
            border: "1px solid #d6dbe1",
            borderRadius: "4px",
            background: isTarget ? "#edf5ff" : "#fff",
            opacity: isDragging ? 0.45 : 1,
            transition: "background-color 100ms ease, opacity 100ms ease",
            boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,.16)" : "none",
            borderTop: isTarget && !self.state.dropAfter ? "3px solid #2868c7" : "1px solid #d6dbe1",
            borderBottom: isTarget && self.state.dropAfter ? "3px solid #2868c7" : "1px solid #d6dbe1",
          };
          return h("li", {
            key: title,
            draggable: true,
            onDragStart: function (event) { self.handleDragStart(event, title); },
            onDragOver: function (event) { self.handleDragOver(event, title); },
            onDrop: function (event) { event.preventDefault(); self.finishDrag(); },
            onDragEnd: self.finishDrag,
            style: style,
          }, h("span", { style: { display: "inline-block", width: "22px", color: "#7a8794" }, "aria-hidden": "true" }, "⠿"), title);
        }))
      );
    },
  });

  CMS.registerWidget("order_sync", OrderSyncControl);
})();
