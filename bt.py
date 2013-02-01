# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify, make_response, render_template, flash, redirect, url_for, session, escape, g

from bigtree.web import index
from bigtree.api import api_landing, bigtree

app = Flask(__name__)
app.config.from_pyfile('default.cfg')
app.config.from_pyfile('local.cfg')

# URLs
app.add_url_rule('/', 'index', index)
app.add_url_rule('/api', 'api', api_landing)
app.add_url_rule('/api/bigtree', 'bigtree', bigtree, methods=['GET', 'POST'])
  
if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
